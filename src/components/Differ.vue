<template>
  <v-content>
    <v-layout>
      <v-spacer xs11></v-spacer>
    </v-layout>
    <v-layout column>
      <v-flex>
        <v-textarea :value="text" :rows="lines" no-resize hide-details readonly></v-textarea>
      </v-flex>
    </v-layout>
  </v-content>
</template>

<script>
import { api_call } from "../utils/api";

export default {
  name: "differ",
  data: function() {
    return {
      text: ""
    };
  },
  props: ["plugin_name", "resource_id", "timestamp_index"],
  computed: {
    lines: function() {
      return this.text.split("\n").length;
    }
  },
  methods: {
    get_diff: function() {
      let url = "/api/get_plugin_result_diff";
      let params = {
        plugin_name: this.plugin_name,
        resource_id: this.resource_id,
        index: this.timestamp_index
      };

      api_call({ url, params }).then(resp => {
        this.text = resp.data.diff;
      });
    }
  },
  mounted: function() {
    this.get_diff();
  },
  watch: {
    timestamp_index: {
      handler: function() {
        this.get_diff();
      }
    }
  }
};
</script>
