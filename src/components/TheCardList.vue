<template>
  <v-flex v-if="items !== undefined" shrink>
    <v-card>
      <v-card-title>
        <v-layout wrap>
          <v-flex xs12>
            <v-layout>
              <v-flex text-xs-left class="font-weight-bold">{{ title }}</v-flex>
              <v-flex text-xs-right>
                <copy-to-clipboard :text_to_copy="items.join('\n')"></copy-to-clipboard>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex>
            <v-divider></v-divider>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-card-text>
        <v-card>
          <v-card-text>
            <v-layout wrap>
              <v-flex v-for="(item, index) in items" :key="index" xs12>
                <v-layout>
                  <v-flex shrink>{{ item }}</v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
import CopyToClipboard from "./CopyToClipboard";

export default {
  name: "the-card-list",
  components: { CopyToClipboard },
  props: {
    items: { type: Array },
    title: { type: String }
  },
  data() {
    return {};
  }
};
</script>