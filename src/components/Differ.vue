<template>
  <v-card>
    <v-card-title class="headline">Differ</v-card-title>
    <v-card-text>{{ text }}</v-card-text>
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
  methods: {
    get_diff: function() {
      let url = "/api/get_plugin_result_diff";
      let params = {
        plugin_name: this.plugin_name,
        resource_id: this.resource_id,
        index: this.index
      };

      api_call(url, params).then(resp => {
        this.text = resp.data.diff;
      });
    }
  },
  mounted() {
    this.get_diff();
  }
};
</script>
