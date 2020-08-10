<template>
  <v-container>
    <v-layout v-if="plugin_data.result_status[0] === 1" wrap>
      <the-card-descriptor :items="resource.results" title="Results"></the-card-descriptor>
    </v-layout>
  </v-container>
</template>

<script>
import { make_unique_list } from "../../../utils/utils";
import TheCardDescriptor from "../../TheCardDescriptor";
import { mapActions } from "vuex";

export default {
  name: "onyphe",
  props: {
    plugin_data: Object
  },
  components: {
    TheCardDescriptor
  },
  data: function() {
    return {};
  },
  computed: {
    resource: function() {
      let plugin_result = { ...this.plugin_data };
      return plugin_result;
    }
  },
  methods: {
    ...mapActions("results", { pushResult: "push" })
  },
  beforeMount: function() {
    this.pushResult({
      // This this.$options.name serves to have the plugin name.
      name: this.$options.name,
      result: JSON.stringify(this.plugin_data.results) || ""
    });
  }
};
</script>
