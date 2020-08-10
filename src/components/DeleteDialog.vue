<template>
  <v-dialog v-model="show" persistent max-width="25%">
    <v-card>
      <v-card-title>
        <v-flex title>{{ title }}</v-flex>
      </v-card-title>
      <v-card-text>
        <v-flex>{{ text }}</v-flex>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-layout>
          <v-flex>
            <the-button color="green darken-1" @click="doit" icon="mdi-check">Yes, do it</the-button>
          </v-flex>
          <v-flex>
            <the-button color="red darken-1" @click="dontdoit" icon="mdi-cancel">No, dismiss</the-button>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import TheButton from "./TheButton";

export default {
  name: "delete-dialog",
  props: ["title", "text", "show"],
  components: { TheButton },

  methods: {
    dontdoit: function() {
      this.$emit("dismiss");
    },
    doit: function() {
      this.$emit("dodelete");
    }
  }
};
</script>
