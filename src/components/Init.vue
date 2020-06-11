<template>
  <v-app id="login" :dark="true">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-card class="elevation-12" width="400">
            <v-toolbar color="grey darken-3" dark flat>
              <v-spacer>
                <v-toolbar-title>thethe init user</v-toolbar-title>
              </v-spacer>
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
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn type="submit" color="primary" form="new_user_form">Save</v-btn>
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
import StatusBar from "./StatusBar";
import api_call from "../utils/api";

export default {
  components: {
    StatusBar
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
      api_call({
        url: "/api/init",

        username: username,
        pass1: password,
        pass2: password_confirmation
      })
        .then(() => {
          this.$router.push("/");
        })
        .catch(err => {
          (this.error = true), (this.error_message = err.data.error_message);
          this.$refs.new_user_form.reset();
        });
    }
  }
};
</script>
