<template>
  <v-dialog v-model="show" persistent max-width="290">
    <v-card>
      <v-card-title class="subheading font-weight-bold">Change password</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form>
          <v-layout column>
            <v-flex xs12 md6>
              <v-text-field
                autocomplete="off"
                v-model="old_password"
                type="password"
                name="old_password"
                label="Old password"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md6>
              <v-text-field
                autocomplete="off"
                v-model="new_password_1"
                type="password"
                name="new_password_1"
                label="New password"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md6>
              <v-text-field
                autocomplete="off"
                v-model="new_password_2"
                type="password"
                name="new_password_2"
                label="Repeat new password"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card-text>
      <v-spacer></v-spacer>
      <v-card-actions>
        <v-layout>
          <v-flex>
            <the-button color="green darken-1" @click="doit" :disabled="password_match">Ok</the-button>
          </v-flex>
          <v-flex>
            <the-button
              color="red darken-1"
              @click="reset_fields();$emit('change-password-closed');"
            >Cancel</the-button>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { api_call } from "../utils/api";
import TheButton from "./TheButton";

export default {
  name: "change-password-dialog",
  props: ["show"],
  data: () => ({
    old_password: "",
    new_password_1: "",
    new_password_2: ""
  }),
  components: { TheButton },
  methods: {
    doit: function() {
      let params = {
        url: "/api/changepassword",
        old_password: this.old_password,
        new_password_1: this.new_password_1,
        new_password_2: this.new_password_2
      };
      api_call(params)
        .then(resp =>
          this.$notify({
            title: "Ok",
            text: resp.data.success_message,
            type: "success"
          })
        )
        .then(resp => this.reset_fields())
        .then(resp => {
          this.$emit("change-password-closed");
        })

        //.then(this.logout())
        .catch(err => {
          if (err.data) {
            this.$notify({
              title: "Error",
              text: err.data.error_message,
              type: "error"
            });
          }
        });
    },

    reset_fields: function() {
      this.old_password = "";
      this.new_password_1 = "";
      this.new_password_2 = "";
    },

    logout: function() {
      this.$store
        .dispatch("AUTH_LOGOUT")
        .then(() => {
          this.$store.dispatch("RESET_PROJECT");
        })
        .then(() => {
          this.$router.push("/login");
        });
    }
  },
  computed: {
    password_match: function() {
      if (
        this.new_password_1.length > 0 &&
        this.new_password_1 === this.new_password_2
      ) {
        return false;
      }

      return true;
    }
  }
};
</script>
