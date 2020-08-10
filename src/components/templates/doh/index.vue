<template>
  <v-layout>
    <v-flex>
      <v-card>
        <v-card-title>
          <v-layout>
            <v-flex text-xs-left class="font-weight-bold" subheading>DoH Response</v-flex>
          </v-layout>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-layout align-center>
            <v-flex class="font-weight-bold">
              <SecLink link="https://doh-beta.e-paths.com" text="doh-beta.e-paths.com"></SecLink>has this domain cathegorized as
            </v-flex>
            <v-flex v-if="results.malicious">
              <v-icon color="red">mdi-skull</v-icon>
              <v-flex>Malicious</v-flex>
            </v-flex>
            <v-flex v-else>
              <v-icon color="green">mdi-thumb-up</v-icon>
              <v-flex>Not Malicious</v-flex>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>


<script>
import SecLink from "../../SecLink";

export default {
  name: "doh",
  components: { SecLink },

  props: {
    plugin_data: Object
  },
  data: function() {
    return {};
  },
  computed: {
    results: function() {
      return this.plugin_data.results;
    }
  }
};
</script>