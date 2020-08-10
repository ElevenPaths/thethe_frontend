<template>
  <v-app id="login" :dark="true">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-card class="elevation-12" width="400">
            <v-toolbar color="grey darken-3" dark flat>
              <v-layout wrap>
                <v-flex>
                  <v-toolbar-title>The Threat Hunting Environment</v-toolbar-title>
                </v-flex>
                <v-flex xs12 pt-2>
                  <v-divider></v-divider>
                </v-flex>
              </v-layout>
            </v-toolbar>
            <v-card-text>
              <v-form class="login" @submit.prevent="save" ref="new_user_form" id="new_user_form">
                <v-text-field
                  label="New thethe user"
                  name="login"
                  prepend-icon="person"
                  type="text"
                  v-model="username"
                  autocomplete="off"
                ></v-text-field>
                <v-text-field
                  id="password"
                  label="Password"
                  name="password"
                  prepend-icon="lock"
                  type="password"
                  v-model="password"
                ></v-text-field>
                <v-text-field
                  id="password_confirmation"
                  label="repeat password"
                  name="password"
                  prepend-icon="lock"
                  type="password"
                  v-model="password_confirmation"
                ></v-text-field>
                <v-alert :value="error" type="error">{{ error_message }}</v-alert>
              </v-form>
            </v-card-text>
            <v-card-text>
              <v-layout>
                <v-flex>
                  <v-sheet color="blue">
                    <b>Welcome to The Threat Hunting Enviroment.</b>
                    <br />
                    <br />You need to create an initial administrator account.
                    This account will serve as an
                    <b>admin</b>.
                    <br />
                    <br />Choose a
                    <b>strong password</b> (min. 8 characters, mixing alphanums and signs.)
                    <br />
                    <br />
                    <b>Weak password won't be allowed.</b>
                  </v-sheet>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-layout wrap>
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
                <v-flex pt-3>
                  <v-btn type="submit" color="primary" outline form="new_user_form">Save</v-btn>
                </v-flex>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-layout>
        <status-bar></status-bar>
        <!-- <img src="../../static/images/logo_lab_11paths.png" height="64" /> -->
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import TheButton from "./TheButton";
import { api_call } from "../utils/api";

export default {
  components: {
    TheButton
  },
  data() {
    return {
      username: "",
      password: "",
      password_confirmation: "",
      error: false,
      error_message: ""
    };
  },
  methods: {
    save: function() {
      const { username, password, password_confirmation } = this;
      this.error = false;
      api_call({
        url: "/api/init",

        username: username,
        password1: password,
        password2: password_confirmation
      })
        .then(() => {
          this.$router.push("/login");
        })
        .catch(err => {
          (this.error = true), (this.error_message = err.data.error_message);
          this.$refs.new_user_form.reset();
        });
    }
  },
  beforeMount: function() {
    api_call({
      url: "/api/check_init"
    })
      .then(resp => {
        if (resp.data) {
          this.$router.push("/login");
        }
      })
      .catch(err => {
        console.log(err);
      });

    if (this.$store.getters["is_authenticated"]) {
      this.$router.push("/");
    }
  }
};
</script>
