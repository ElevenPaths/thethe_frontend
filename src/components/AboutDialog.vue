<template>
  <v-dialog v-model="show" persistent max-width="40%">
    <v-card>
      <v-card-title>
        <v-flex title>The Threat Hunting Environment</v-flex>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-layout align-center justify-center wrap>
          <v-flex xs12>
            <v-layout column>
              <v-flex pb-3>
                <img :src="require('@/assets/11p_logo.png')" width="125px" />
              </v-flex>
              <v-flex class="font-weight-bold">Versión v{{ APP_VERSION }}</v-flex>
              <v-flex>&copy;&nbsp;{{ new Date().getFullYear() }}&nbsp;ElevenPaths</v-flex>
            </v-layout>
          </v-flex>
          <v-flex pt-4>
            <v-layout align-center justify-end>
              <v-flex class="font-weight-bold">
                A new feature or bug? Fill an issue in our Github.
                <the-button color="yellow" icon="call" round @click="feedback()">Feedback</the-button>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-layout wrap align-center justify-center>
          <v-flex>
            <the-button color="blue" @click="$emit('close')" icon="mdi-sync">Ok</the-button>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import TheButton from "./TheButton";
import SecLink from "./SecLink";

export default {
  name: "about-dialog",
  components: { TheButton, SecLink },
  props: ["show"],
  data: function() {
    return {
      APP_VERSION: require("../../package.json").version
    };
  },
  methods: {
    feedback: function() {
      window.open(
        "https://github.com/ElevenPaths/thethe/issues/new",
        "_newtab"
      );
    }
  }
};
</script>
