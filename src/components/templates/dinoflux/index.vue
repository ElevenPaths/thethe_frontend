<template>
  <v-container v-if="resource.analyses.length === -1" class="font-weight-medium" subheading>
    <v-layout>
      <v-flex>
        <v-card>
          <v-card-title>Not results in Dinoflux</v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
  <v-container v-else class="text-xs-left">
    <v-layout column>
      <v-flex title>Dinoflux information</v-flex>
      <v-expansion-panel accordion v-for="(analysis, index) in resource.analyses" :key="index">
        <v-expansion-panel-content>
          <template v-slot:header>
            <div>{{ analysis.url_report }}</div>
          </template>
          <v-card>
            <v-card-text>
              <v-layout align-start>
                <v-flex>Network observables</v-flex>
                <v-flex>{{ analysis.network.n_observables }}</v-flex>
              </v-layout>
              <v-layout align-start>
                <v-flex>Date</v-flex>
                <v-flex>{{ formatted_time(analysis.timestamp) }}</v-flex>
              </v-layout>
              <v-layout align-start>
                <v-flex>Threat</v-flex>
                <v-flex>
                  <v-chip>{{ analysis.threat }}</v-chip>
                </v-flex>
              </v-layout>

              <v-layout align-start column>
                <v-flex class="font-weight-bold">Sandbox</v-flex>
                <v-flex>Score: {{ analysis.sandbox.info.score }}</v-flex>
                <v-flex>Signatures</v-flex>
                <v-flex>
                  <v-list two-line>
                    <v-list-tile
                      v-for="(signature, index) in analysis.sandbox.signatures"
                      :key="index"
                    >
                      <v-chip>{{ signature.name }}</v-chip>
                      <v-chip>severity:{{ signature.severity }}</v-chip>
                      <v-flex caption>{{ signature.description }}</v-flex>
                    </v-list-tile>
                  </v-list>
                </v-flex>
              </v-layout>

              <v-layout align-start column>
                <v-flex>Hashes</v-flex>
                <v-flex>
                  <v-card accordion v-for="(value, key) in analysis.hashes" :key="key">
                    <v-card-text>
                      <v-flex class="font-weight-bold">{{ key }}</v-flex>
                      <v-flex v-for="(hash, index) in value" :key="index">{{ hash }}</v-flex>
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "dinoflux",

  props: {
    plugin_data: Object
  },

  data: function() {
    return {};
  },

  methods: {
    formatted_time: function(ts) {
      let t = new Date(ts * 1000);
      return `${t.toLocaleDateString()} at ${t.toLocaleTimeString()}`;
    }
  },
  computed: {
    resource: function() {
      let plugin_result = { ...this.plugin_data.results };
      return plugin_result;
    }
  }
};
</script>
