<template>
  <v-flex>
    <v-layout>
      <v-flex>
        <v-layout align-center justify-center>
          <v-flex text-xs-left xs1 title>Abuse Confidence Score</v-flex>
          <v-flex>
            <v-progress-circular
              :rotate="360"
              :size="100"
              :width="15"
              :value="resource.abuseConfidenceScore"
              :color="abuse_confidence_score_color"
            >{{ resource.abuseConfidenceScore }}%</v-progress-circular>
          </v-flex>
          <v-flex>
            <v-layout py-2 column text-xs-left>
              <v-flex>Total reports</v-flex>
              <v-flex>Distinct users</v-flex>
              <v-flex>Domain</v-flex>
              <v-flex>Reported at</v-flex>
            </v-layout>
          </v-flex>
          <v-flex>
            <v-layout column text-xs-left>
              <v-flex>{{ resource.totalReports }}</v-flex>
              <v-flex>{{ resource.numDistinctUsers }}</v-flex>
              <v-flex class="font-weight-bold">{{ resource.domain }}</v-flex>
              <v-flex v-if="resource.lastReportedAt">
                {{ new Date(resource.lastReportedAt).toLocaleDateString() }}
                <v-chip>{{ days_ago }}</v-chip>
                <span>days ago</span>
              </v-flex>
              <v-flex v-else>
                <span>N/D</span>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
import { make_unique_list } from "../../../utils/utils";
import { mapActions } from "vuex";

export default {
  name: "abuseipdb",
  props: {
    plugin_data: Object
  },
  data: function() {
    return {};
  },
  methods: {
    ...mapActions("results", { pushResult: "push" })
  },
  computed: {
    resource: function() {
      let plugin_result = { ...this.plugin_data.results };
      return plugin_result.data;
    },
    abuse_confidence_score_color: function() {
      let score = this.resource.abuseConfidenceScore;

      if (score < 33) {
        return "yellow";
      } else if (score >= 33 && score <= 66) {
        return "orange";
      } else if (score > 66) {
        return "red";
      }

      return "blue";
    },

    days_ago: function() {
      let past = new Date(this.resource.lastReportedAt).getTime();
      let today = new Date().getTime();
      return Math.floor((today - past) / (24 * 60 * 60 * 60));
    }
  },
  // watch: {
  //   scan: function(n, o) {
  //     this.pushResult({
  //       // This this.$options.name serves to have the plugin name.
  //       name: this.$options.name,
  //       result: this.plugin_data.results.data.domain || ""
  //     });
  //   }
  // },
  beforeMount: function() {
    this.pushResult({
      // This this.$options.name serves to have the plugin name.
      name: this.$options.name,
      result: this.plugin_data.results.data.domain || ""
    });
  }
};
</script>
