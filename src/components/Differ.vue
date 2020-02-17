<template>
  <v-card>
    <v-card-text>
      <v-btn small @click="get_diff()">get diff</v-btn>
      <v-textarea :value="text" :rows="lines"></v-textarea>
    </v-card-text>
    <v-spacer></v-spacer>
    <v-card-actions></v-card-actions>
  </v-card>
</template>

<script>
import api_call from "../utils/api";

export default {
  name: "differ",
  data: function() {
    return {
      text: ""
    };
  },
  props: ["plugin_name", "resource_id", "index"],
  computed: {
    lines: function() {
      return this.text.split("\n").length;
    }
  },
  methods: {
    get_diff: function() {
      if (this.index === 0) {
        return;
      }

      let url = "/api/get_plugin_result_diff";
      let params = {
        plugin_name: this.plugin_name,
        resource_id: this.resource_id,
        index: this.index
      };

      api_call({ url, params }).then(resp => {
        this.text = resp.data.diff;
      });
    }
  }
};
</script>
