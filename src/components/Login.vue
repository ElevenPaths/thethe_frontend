<template>
  <v-app id="login" :dark="true">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-card class="elevation-12">
            <v-toolbar color="grey darken-3" dark flat>
              <v-spacer>
                <v-toolbar-title>The Threat Hunting Environment</v-toolbar-title>
              </v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form class="login" @submit.prevent="login" ref="login_form" id="login_form">
                <v-text-field
                  label="Login"
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
                  @keyup.enter="login"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-layout>
                <v-spacer></v-spacer>
                <v-flex xs12>
                  <the-button color="blue" @click="login">Login</the-button>
                </v-flex>
              </v-layout>
            </v-card-actions>
            <template v-if="auth_status === 'error'">
              <v-alert
                type="error"
                dismissible
                :value="true"
              >User does not exist or Password is wrong</v-alert>
            </template>
          </v-card>
        </v-layout>
        <!-- <img src="../../static/images/logo_lab_11paths.png" height="64" /> -->
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import TheButton from "./TheButton";

import { mapGetters } from "vuex";
import { api_call } from "../utils/api";

export default {
  components: {
    TheButton
  },
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    login: function() {
      const { username, password } = this;
      this.$store
        .dispatch("AUTH_REQUEST", { username, password })
        .then(() => {
          this.$router.push("/");
        })
        .catch(err => this.$refs.login_form.reset());
    }
  },
  computed: {
    ...mapGetters({ auth_status: "auth_status" })
  },

  beforeMount: function() {
    api_call({
      url: "/api/check_init"
    })
      .then(resp => {
        if (!resp.data) {
          this.$router.push("/init");
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
