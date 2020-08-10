<template>
  <v-container>
    <v-layout v-if="resource.type_query === 'ip'" row wrap class="subheading">
      <v-flex>
        <v-card>
          <v-card-title class="font-weight-bold">whois</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout justify-center align-center>
              <v-flex>
                <v-chip>{{ resource.whois.status_code }}</v-chip>
              </v-flex>
              <v-flex>{{ resource.whois.status_message }}</v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-card-text>
          <v-card-text v-for="(result, index) in resource.whois.results" :key="index">
            <v-layout v-for="(value, key) in result" :key="key">
              <v-flex xs4 class="font-weight-bold" text-xs-right>{{ key }}</v-flex>
              <v-flex text-xs-left>{{ value }}</v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
      </v-flex>
      <v-flex>
        <v-card>
          <v-card-title class="font-weight-bold">Passive DNS</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout justify-center align-center>
              <v-flex>
                <v-chip>{{ resource.passivedns.status_code }}</v-chip>
              </v-flex>
              <v-flex>{{ resource.passivedns.status_message }}</v-flex>
              <v-flex>
                <v-chip color="info">{{ resource.passivedns.results.length }}</v-chip>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-card-text>
          <v-flex class="scrollable">
            <v-card-text v-for="(result, index) in resource.passivedns.results" :key="index">
              <v-layout v-for="(value, key) in result" :key="key">
                <v-flex xs4 class="font-weight-bold" text-xs-right>{{ key }}</v-flex>
                <v-flex text-xs-left>{{ value }}</v-flex>
              </v-layout>
            </v-card-text>
          </v-flex>
          <v-divider></v-divider>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card>
          <v-card-title class="font-weight-bold">Query URI</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout justify-center align-center>
              <v-flex>
                <v-chip>{{ resource.queryuri.status_code }}</v-chip>
              </v-flex>
              <v-flex>{{ resource.queryuri.status_message }}</v-flex>
              <v-flex>
                <v-chip color="info">{{ resource.queryuri.results.length }}</v-chip>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-card-text>
          <v-flex class="scrollable">
            <v-card-text v-for="(result, index) in resource.queryuri.results" :key="index">
              <v-layout v-for="(value, key) in result" :key="key">
                <v-flex xs4 class="font-weight-bold" text-xs-right>{{ key }}</v-flex>
                <v-flex text-xs-left>{{ value }}</v-flex>
              </v-layout>
            </v-card-text>
          </v-flex>
          <v-divider></v-divider>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card>
          <v-card-title class="font-weight-bold">Samples</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout justify-center align-center>
              <v-flex>
                <v-chip>{{ resource.samples.status_code }}</v-chip>
              </v-flex>
              <v-flex>{{ resource.samples.status_message }}</v-flex>
              <v-flex>
                <v-chip color="info">{{ resource.samples.results.length }}</v-chip>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-card-text>
          <v-flex class="scrollable">
            <v-card-text>
              <v-layout v-for="(result, index) in resource.samples.results" :key="index">
                <v-flex text-xs-left>{{ result }}</v-flex>
              </v-layout>
            </v-card-text>
          </v-flex>
          <v-divider></v-divider>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card>
          <v-card-title class="font-weight-bold">SSL Certs</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout justify-center align-center>
              <v-flex>
                <v-chip>{{ resource.sslcerts.status_code }}</v-chip>
              </v-flex>
              <v-flex>{{ resource.sslcerts.status_message }}</v-flex>
              <v-flex>
                <v-chip color="info">{{ resource.sslcerts.results.length }}</v-chip>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-card-text>
          <v-card-text>
            <v-layout v-for="(result, index) in resource.sslcerts.results" :key="index">
              <v-flex text-xs-left>{{ result }}</v-flex>
            </v-layout>
          </v-card-text>
          <v-divider></v-divider>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card>
          <v-card-title class="font-weight-bold">Report Tag</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout justify-center align-center>
              <v-flex>
                <v-chip>{{ resource.reporttag.status_code }}</v-chip>
              </v-flex>
              <v-flex>{{ resource.reporttag.status_message }}</v-flex>
              <v-flex>
                <v-chip color="info">{{ resource.reporttag.results.length }}</v-chip>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-card-text>
          <v-card-text>
            <v-layout
              v-for="(result, index) in resource.reporttag.results"
              :key="index"
              align-center
            >
              <v-flex>
                <SecLink :url="result.URL" :text="result.filename"></SecLink>
              </v-flex>
              <v-flex>
                <v-chip>{{ result.year }}</v-chip>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-divider></v-divider>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout v-if="resource.type_query === 'domain'" row wrap class="subheading">
      <v-flex>
        <v-card>
          <v-card-title class="font-weight-bold">whois</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout justify-center align-center>
              <v-flex>
                <v-chip>{{ resource.whois.status_code }}</v-chip>
              </v-flex>
              <v-flex>{{ resource.whois.status_message }}</v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-card-text>
          <v-card-text v-for="(result, index) in resource.whois.results" :key="index">
            <v-layout v-for="(value, key) in result" :key="key">
              <template v-if="key === 'whois'">
                <!-- <v-card-text v-for="(value, key, index) in value" :key="index">
                  <template>
                    <v-flex xs4 class="font-weight-bold">{{ key }}</v-flex>
                    <v-flex text-xs-left>{{ value }}</v-flex>
                  </template>
                </v-card-text>-->
              </template>
              <template v-else-if="key === 'last_updated'">
                <v-card-text>
                  <v-layout row align-center justify-center>
                    <v-flex xs4 class="font-weight-bold" text-xs-right>last updated</v-flex>
                    <v-flex>sec</v-flex>
                    <v-flex>
                      <v-chip>{{ value.sec }}</v-chip>
                    </v-flex>
                    <v-flex>usec</v-flex>
                    <v-flex>
                      <v-chip>{{ value.usec }}</v-chip>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </template>
              <template v-else>
                <v-flex xs4 class="font-weight-bold" text-xs-right>{{ key }}</v-flex>
                <v-flex text-xs-left>{{ value }}</v-flex>
              </template>
            </v-layout>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
      </v-flex>
      <v-flex>
        <v-card>
          <v-card-title class="font-weight-bold">Passive DNS</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout justify-center align-center>
              <v-flex>
                <v-chip>{{ resource.passivedns.status_code }}</v-chip>
              </v-flex>
              <v-flex>{{ resource.passivedns.status_message }}</v-flex>
              <v-flex>
                <v-chip color="info">{{ resource.passivedns.results.length }}</v-chip>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-card-text>
          <v-flex class="scrollable">
            <v-card-text v-for="(result, index) in resource.passivedns.results" :key="index">
              <v-layout v-for="(value, key) in result" :key="key">
                <v-flex xs4 class="font-weight-bold" text-xs-right>{{ key }}</v-flex>
                <v-flex text-xs-left>{{ value }}</v-flex>
              </v-layout>
            </v-card-text>
          </v-flex>
          <v-divider></v-divider>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card>
          <v-card-title class="font-weight-bold">Query URI</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout justify-center align-center>
              <v-flex>
                <v-chip>{{ resource.queryuri.status_code }}</v-chip>
              </v-flex>
              <v-flex>{{ resource.queryuri.status_message }}</v-flex>
              <v-flex>
                <v-chip color="info">{{ resource.queryuri.results.length }}</v-chip>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-card-text>
          <v-flex class="scrollable">
            <v-card-text v-for="(result, index) in resource.queryuri.results" :key="index">
              <v-layout v-for="(value, key) in result" :key="key">
                <v-flex xs4 class="font-weight-bold" text-xs-right>{{ key }}</v-flex>
                <v-flex text-xs-left>{{ value }}</v-flex>
              </v-layout>
            </v-card-text>
          </v-flex>
          <v-divider></v-divider>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card>
          <v-card-title class="font-weight-bold">Samples</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout justify-center align-center>
              <v-flex>
                <v-chip>{{ resource.samples.status_code }}</v-chip>
              </v-flex>
              <v-flex>{{ resource.samples.status_message }}</v-flex>
              <v-flex>
                <v-chip color="info">{{ resource.samples.results.length }}</v-chip>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-card-text>
          <v-flex class="scrollable">
            <v-card-text>
              <v-layout v-for="(result, index) in resource.samples.results" :key="index">
                <v-flex text-xs-left>{{ result }}</v-flex>
              </v-layout>
            </v-card-text>
          </v-flex>
          <v-divider></v-divider>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card>
          <v-card-title class="font-weight-bold">Subdomains</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout justify-center align-center>
              <v-flex>
                <v-chip>{{ resource.subdomains.status_code }}</v-chip>
              </v-flex>
              <v-flex>{{ resource.subdomains.status_message }}</v-flex>
              <v-flex>
                <v-chip color="info">{{ resource.subdomains.results.length }}</v-chip>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-card-text>
          <v-card-text>
            <v-layout v-for="(result, index) in resource.subdomains.results" :key="index">
              <v-flex text-xs-left>{{ result }}</v-flex>
            </v-layout>
          </v-card-text>
          <v-divider></v-divider>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card>
          <v-card-title class="font-weight-bold">Report Tag</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout justify-center align-center>
              <v-flex>
                <v-chip>{{ resource.reporttag.status_code }}</v-chip>
              </v-flex>
              <v-flex>{{ resource.reporttag.status_message }}</v-flex>
              <v-flex>
                <v-chip color="info">{{ resource.reporttag.results.length }}</v-chip>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-card-text>
          <v-card-text>
            <v-layout
              v-for="(result, index) in resource.reporttag.results"
              :key="index"
              align-center
            >
              <v-flex>
                <SecLink :url="result.URL" :text="result.filename"></SecLink>
              </v-flex>
              <v-flex>
                <v-chip>{{ result.year }}</v-chip>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-divider></v-divider>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout v-if="resource.type_query === 'hash'" row wrap class="subheading">
      <v-flex>
        <v-card>
          <v-card-title class="font-weight-bold">Metadata</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout justify-center align-center>
              <v-flex>
                <v-chip>{{ resource.metadata.status_code }}</v-chip>
              </v-flex>
              <v-flex>{{ resource.metadata.status_message }}</v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-card-text>
          <v-card-text v-for="(result, index) in resource.metadata.results" :key="index">
            <v-layout v-for="(value, key) in result" :key="key">
              <template>
                <v-flex xs4 class="font-weight-bold" text-xs-right>{{ key }}</v-flex>
                <v-flex text-xs-left>{{ value }}</v-flex>
              </template>
            </v-layout>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
      </v-flex>

      <v-flex>
        <v-card>
          <v-card-title class="font-weight-bold">HTTP Traffic</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout justify-center align-center>
              <v-flex>
                <v-chip>{{ resource.httptraffic.status_code }}</v-chip>
              </v-flex>
              <v-flex>{{ resource.httptraffic.status_message }}</v-flex>
              <v-flex>
                <v-chip color="info">{{ resource.httptraffic.results.length }}</v-chip>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-card-text>
          <v-flex class="scrollable">
            <v-card-text v-for="(result, index) in resource.httptraffic.results" :key="index">
              <v-layout v-for="(value, key) in result" :key="key">
                <v-flex xs4 class="font-weight-bold" text-xs-right>{{ key }}</v-flex>
                <v-flex text-xs-left>{{ value }}</v-flex>
              </v-layout>
            </v-card-text>
          </v-flex>
          <v-divider></v-divider>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card>
          <v-card-title class="font-weight-bold">Hosts</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout justify-center align-center>
              <v-flex>
                <v-chip>{{ resource.hosts.status_code }}</v-chip>
              </v-flex>
              <v-flex>{{ resource.hosts.status_message }}</v-flex>
              <v-flex>
                <v-chip color="info">{{ resource.hosts.results.length }}</v-chip>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-card-text>
          <v-flex class="scrollable">
            <v-card-text v-for="(result, index) in resource.hosts.results" :key="index">
              <v-layout v-for="(value, key) in result" :key="key">
                <v-flex xs4 class="font-weight-bold" text-xs-right>{{ key }}</v-flex>
                <v-flex text-xs-left>{{ value }}</v-flex>
              </v-layout>
            </v-card-text>
          </v-flex>
          <v-divider></v-divider>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card>
          <v-card-title class="font-weight-bold">Mutants</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout justify-center align-center>
              <v-flex>
                <v-chip>{{ resource.mutants.status_code }}</v-chip>
              </v-flex>
              <v-flex>{{ resource.mutants.status_message }}</v-flex>
              <v-flex>
                <v-chip color="info">{{ resource.mutants.results.length }}</v-chip>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-card-text>
          <v-flex class="scrollable">
            <v-card-text v-for="(result, index) in resource.mutants.results" :key="index">
              <v-layout v-for="(value, key) in result" :key="key">
                <v-flex xs4 class="font-weight-bold" text-xs-right>{{ key }}</v-flex>
                <v-flex text-xs-left>{{ value }}</v-flex>
              </v-layout>
            </v-card-text>
          </v-flex>
          <v-divider></v-divider>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card>
          <v-card-title class="font-weight-bold">Regkeys</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout justify-center align-center>
              <v-flex>
                <v-chip>{{ resource.regkeys.status_code }}</v-chip>
              </v-flex>
              <v-flex>{{ resource.regkeys.status_message }}</v-flex>
              <v-flex>
                <v-chip color="info">{{ resource.regkeys.results.length }}</v-chip>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-card-text>
          <v-flex class="scrollable">
            <v-card-text v-for="(result, index) in resource.regkeys.results" :key="index">
              <v-layout v-for="(value, key) in result" :key="key">
                <v-flex xs4 class="font-weight-bold" text-xs-right>{{ key }}</v-flex>
                <v-flex text-xs-left>{{ value }}</v-flex>
              </v-layout>
            </v-card-text>
          </v-flex>
          <v-divider></v-divider>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card>
          <v-card-title class="font-weight-bold">AV Detections</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout justify-center align-center>
              <v-flex>
                <v-chip>{{ resource.avdetect.status_code }}</v-chip>
              </v-flex>
              <v-flex>{{ resource.avdetect.status_message }}</v-flex>
              <v-flex>
                <v-chip color="info">{{ resource.avdetect.results.length }}</v-chip>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-card-text>
          <v-flex class="scrollable">
            <v-card-text v-for="(result, index) in resource.avdetect.results" :key="index">
              <v-layout v-for="(av, index) in result.av_detections" :key="index" fill-height>
                <v-flex xs6 class="font-weight-bold" text-xs-right>{{ av.av }}</v-flex>
                <v-flex xs6 text-xs-left>{{ av.detection }}</v-flex>
              </v-layout>
            </v-card-text>
          </v-flex>
          <v-divider></v-divider>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card>
          <v-card-title class="font-weight-bold">Report Tag</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout justify-center align-center>
              <v-flex>
                <v-chip>{{ resource.reporttag.status_code }}</v-chip>
              </v-flex>
              <v-flex>{{ resource.reporttag.status_message }}</v-flex>
              <v-flex>
                <v-chip color="info">{{ resource.reporttag.results.length }}</v-chip>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-card-text>
          <v-card-text>
            <v-layout
              v-for="(result, index) in resource.reporttag.results"
              :key="index"
              align-center
            >
              <v-flex>
                <SecLink :url="result.URL" :text="result.filename"></SecLink>
              </v-flex>
              <v-flex>
                <v-chip>{{ result.year }}</v-chip>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-divider></v-divider>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import SecLink from "../../SecLink";
import { countryCode } from "../../../utils/country2ccode";
import { mapActions } from "vuex";

export default {
  name: "threatminer",
  components: { SecLink },
  props: {
    plugin_data: Object
  },
  data: function() {
    return {};
  },
  computed: {
    resource: function() {
      let plugin_result = this.plugin_data.results;
      return plugin_result;
    }
  },
  methods: {
    ...mapActions("results", { pushResult: "push" }),
    countryCode2: function(country) {
      return countryCode(country);
    },
    formatted_time: function(ts) {
      let t = new Date(ts);
      return `${t.toLocaleDateString()} at ${t.toLocaleTimeString()}`;
    },
    copy_content: async function(data) {
      await navigator.clipboard.writeText(data);
    }
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

<style scoped>
.scrollable {
  max-height: 500px;
  overflow-y: auto;
}
</style>
