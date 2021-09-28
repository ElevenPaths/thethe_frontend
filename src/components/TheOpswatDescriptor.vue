<template>
  <v-flex v-if="items !== undefined" shrink>
    <v-card>
      <v-card-title>
        <v-layout wrap>
          <v-flex xs12 text-xs-left class="font-weight-bold">{{ title }}</v-flex>
          <v-flex>
            <v-divider></v-divider>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-card-text>
        <v-card>
          <v-card-text>
            <v-layout wrap>
              <v-flex v-for="(value, key) in procItems[index - 1]" :key="key" xs12>
                <v-layout>
                  <v-flex class="font-weight-bold" text-xs-left xs2>{{ key }}</v-flex>
                  <v-flex shrink>{{ value.threat_found }}</v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-card-text>
      <v-card-actions v-if="doPaginate">
        <v-flex>
          <v-pagination v-model="index" :length="procItems.length"></v-pagination>
        </v-flex>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: "the-opswat-descriptor",
  props: {
    items: { type: [Array, Object] },
    title: { type: String },
    skip: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return { index: 1 };
  },
  computed: {
    doPaginate: function() {
      if (Array.isArray(this.items) && this.items.length > 1) {
        return true;
      }
      return false;
    },
    procItems: function() {
      if (Array.isArray(this.items)) {
        return this.items;
      }
      return [this.items];
    }
  }
};
</script>