<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn flat icon small color="grey" @click="copy_content()">
        <v-icon small v-on="on">mdi-content-copy</v-icon>
      </v-btn>
    </template>
    <span>Copy content to clipboard</span>
  </v-tooltip>
</template>

<script>
export default {
  name: "copy-to-clipboard",
  props: ["text_to_copy"],
  methods: {
    copy_content: async function() {
      await navigator.clipboard.writeText(this.text_to_copy);
    }
  }
};
</script>
