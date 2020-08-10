<template>
  <v-container fluid grid-list-xs>
    <v-layout wrap v-if="plugin_data.result_status == 2">
      <v-flex
        subheading
        class="font-weight-bold"
      >The resource is not alive or could not be processed by urlscan</v-flex>
    </v-layout>
    <v-layout v-else wrap>
      <v-flex shrink>
        <v-card v-if="data.verdicts.hasOwnProperty('urlscan')">
          <v-card-title>
            <v-flex text-xs-left class="font-weight-bold" xs12>Verdicts</v-flex>
            <v-flex>
              <v-divider></v-divider>
            </v-flex>
          </v-card-title>
          <v-card-text>
            <v-layout wrap>
              <v-flex>
                <v-card>
                  <v-card-title>
                    <v-flex text-xs-left class="font-weight-bold" xs12>URLscan</v-flex>
                    <v-flex>
                      <v-divider></v-divider>
                    </v-flex>
                  </v-card-title>
                  <v-card-text>
                    <v-layout wrap align-center>
                      <v-flex>
                        <the-percentage :percentage="data.verdicts.urlscan.score"></the-percentage>
                      </v-flex>
                      <v-flex v-for="tag in data.verdicts.urlscan.tags" :key="tag">
                        <v-chip>
                          <v-flex class="font-weight-bold">{{tag}}</v-flex>
                        </v-chip>
                      </v-flex>
                      <v-flex>
                        <v-icon
                          :color="data.verdicts.urlscan.malicious? 'red': 'green'"
                        >{{data.verdicts.urlscan.malicious? 'mdi-skull': 'mdi-emoticon-happy'}}</v-icon>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex>
                <v-card>
                  <v-card-title>
                    <v-flex text-xs-left class="font-weight-bold" xs12>Engines</v-flex>
                    <v-flex>
                      <v-divider></v-divider>
                    </v-flex>
                  </v-card-title>
                  <v-card-text>
                    <v-layout wrap align-center>
                      <v-flex>
                        <the-percentage :percentage="data.verdicts.engines.score"></the-percentage>
                      </v-flex>
                      <v-layout
                        align-center
                        column
                        v-if="data.verdicts.engines.malicious.length > 0"
                      >
                        <v-flex>Tagged as malicious</v-flex>
                        <v-flex v-for="engine in data.verdicts.engines.malicious" :key="engine">
                          <v-chip color="red">
                            <v-flex class="font-weight-bold">{{engine}}</v-flex>
                          </v-chip>
                        </v-flex>
                      </v-layout>
                      <v-layout align-center column v-if="data.verdicts.engines.benign.length > 0">
                        <v-flex>Tagged as benign</v-flex>
                        <v-flex v-for="engine in data.verdicts.engines.benign" :key="engine">
                          <v-chip color="green">
                            <v-flex class="font-weight-bold">{{engine}}</v-flex>
                          </v-chip>
                        </v-flex>
                      </v-layout>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex>
                <v-card>
                  <v-card-title>
                    <v-flex text-xs-left class="font-weight-bold" xs12>Community</v-flex>
                    <v-flex>
                      <v-divider></v-divider>
                    </v-flex>
                  </v-card-title>
                  <v-card-text>
                    <v-layout wrap>
                      <v-flex>
                        <the-percentage :percentage="data.verdicts.community.score"></the-percentage>
                      </v-flex>
                      <v-flex>
                        <v-divider vertical></v-divider>
                      </v-flex>
                      <v-flex pl-4>
                        <v-layout column>
                          <v-layout row>
                            <v-flex>Votes malicious:</v-flex>
                            <v-flex>{{data.verdicts.community.votesMalicious}}</v-flex>
                          </v-layout>
                          <v-layout row>
                            <v-flex>Votes benign:</v-flex>
                            <v-flex>{{data.verdicts.community.votesBenign}}</v-flex>
                          </v-layout>
                          <v-layout row>
                            <v-flex>Votes total:</v-flex>
                            <v-flex>{{data.verdicts.community.votesTotal}}</v-flex>
                          </v-layout>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
      <the-card-list v-if="data.lists.urls.length > 0" :items="data.lists.urls" title="URLs"></the-card-list>
      <request-inspector v-if="data.data.requests.length > 0" :traffic="data.data.requests"></request-inspector>
      <the-card-descriptor
        v-if="data.data.cookies.length > 0"
        :items="data.data.cookies"
        title="Cookies"
      ></the-card-descriptor>
      <the-card-descriptor v-if="data.data.links.length > 0" :items="data.data.links" title="Links"></the-card-descriptor>
      <the-card-descriptor
        v-if="data.lists.certificates.length > 0"
        :items="data.lists.certificates"
        title="Certificates"
      ></the-card-descriptor>
      <v-flex v-if="data.screenshot">
        <v-card>
          <v-card-title>
            <v-flex text-xs-left class="font-weight-bold" xs12>Screenshot</v-flex>
            <v-flex>
              <v-divider></v-divider>
            </v-flex>
          </v-card-title>
          <v-card-text>
            <img width="75%" :src="data.screenshot" />
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import TheCardDescriptor from "../../TheCardDescriptor";
import TheCardList from "../../TheCardList";
import ThePercentage from "../../ThePercentage";
import RequestInspector from "./RequestInspector";
import CopyToClipboard from "../../CopyToClipboard";

export default {
  name: "urlscan",
  props: {
    plugin_data: Object
  },
  components: {
    TheCardDescriptor,
    TheCardList,
    ThePercentage,
    RequestInspector,
    CopyToClipboard
  },
  data: function() {
    return {};
  },
  computed: {
    data: function() {
      let plugin_result = { ...this.plugin_data };
      plugin_result["results"] = window.atob(
        window.atob(this.plugin_data.results)
      );
      return JSON.parse(plugin_result["results"]);
    }
  },
  methods: {
    copy_content: async function(data) {
      await navigator.clipboard.writeText(data);
    }
  }
};
</script>
