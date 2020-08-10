<template>
  <v-flex v-if="traffic !== undefined" shrink>
    <v-card>
      <v-card-title>
        <v-layout wrap>
          <v-flex xs12 text-xs-left class="font-weight-bold">Request - Response Inspector</v-flex>
          <v-flex>
            <v-divider></v-divider>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-card-text>
        <v-layout column>
          <v-flex v-if="currentRequest !== undefined">
            <v-card>
              <v-card-title>
                <v-flex
                  class="font-weight-bold"
                  subheading
                  text-xs-left
                >Request {{ index }} of {{ traffic.length }}</v-flex>
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
              </v-card-title>
              <v-card-text>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-layout>
                      <v-flex xs2 class="font-weight-bold" text-xs-left>URL</v-flex>
                      <v-flex text-xs-left>{{ currentRequest.url }}</v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12>
                    <v-layout>
                      <v-flex xs2 class="font-weight-bold" text-xs-left>Method</v-flex>
                      <v-flex text-xs-left>{{ currentRequest.method }}</v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12>
                    <v-layout>
                      <v-flex xs2 class="font-weight-bold" text-xs-left>User-Agent</v-flex>
                      <v-flex text-xs-left>{{ currentRequest.headers["User-Agent"] }}</v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex v-if="currentResponse !== undefined">
            <the-card-descriptor
              :items="currentResponse.headers"
              :title="`Response ${index} of ${traffic.length}`"
            ></the-card-descriptor>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions v-if="doPaginate">
        <v-flex>
          <v-pagination v-model="index" :length="traffic.length"></v-pagination>
        </v-flex>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import TheCardDescriptor from "../../TheCardDescriptor";

export default {
  name: "request-inspector",
  components: { TheCardDescriptor },
  props: {
    traffic: { type: Array }
  },
  data() {
    return { index: 1 };
  },
  computed: {
    doPaginate: function() {
      if (Array.isArray(this.traffic) && this.traffic.length > 1) {
        return true;
      }
      return false;
    },
    currentRequest: function() {
      return this.traffic[this.index - 1].request.request;
    },
    currentResponse: function() {
      return this.traffic[this.index - 1].response.response;
    }
  }
};
</script>