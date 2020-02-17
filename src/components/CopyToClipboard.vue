<template>
  <v-btn flat icon small color="grey" @click="copy_content()">
    <v-icon small>mdi-content-copy</v-icon>
  </v-btn>
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
