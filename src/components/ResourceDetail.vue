<template>
  <v-flex :class="{ [`lg${12 - grid_space}`]: true }">
    <v-card>
      <v-card-title primary-title v-if="resource" class="py-1">
        <v-layout align-center justify-center>
          <v-card-text
            v-if="resource.resource_type === 'hash'"
            class="subheading text-xs-center pa-0"
          >
            {{ resource.hash }}
            <copy-to-clipboard :text_to_copy="resource.hash"></copy-to-clipboard>
          </v-card-text>
          <v-card-text v-else class="subheading text-xs-center pa-0 font-weight-bold">
            {{
            resource.canonical_name
            }}
            <copy-to-clipboard :text_to_copy="resource.canonical_name"></copy-to-clipboard>
          </v-card-text>
        </v-layout>
      </v-card-title>
      <v-divider></v-divider>
      <v-tabs slider-color="red" v-model="active" v-if="resource.plugins.length > 0">
        <v-tab ripple v-for="entry in sorted_plugin_list" :key="entry.index">
          {{
          entry.plugin.name
          }}
        </v-tab>
        <v-tabs-items>
          <v-tab-item v-for="entry in sorted_plugin_list" :key="entry.index" lazy>
            <v-container>
              <v-layout justify-center align-center wrap>
                <v-flex v-if="entry.plugin.timestamp" text-xs-left shrink>
                  <v-chip
                    small
                    label
                    class="font-weight-bold"
                  >{{ new Date(entry.plugin.timestamp*1000).toDateString()}}</v-chip>
                </v-flex>
                <v-flex text-xs-left>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn icon :disabled="!getResult(entry.plugin.name).result">
                        <v-icon
                          v-on="on"
                          color="green"
                          @click.stop="setScanOn(entry.plugin.name)"
                        >mdi-radar</v-icon>
                      </v-btn>
                    </template>
                    <span>Scan results for new IOCs</span>
                  </v-tooltip>
                </v-flex>
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
                <v-flex xs12>
                  <dynamic-link :type="entry.plugin.name" :data="entry.plugin" :key="component_key"></dynamic-link>
                </v-flex>
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
                <v-flex xs12>
                  <time-machine
                    :resource="resource._id"
                    :timemachine="entry.plugin.timemachine"
                    :plugin="entry.plugin.name"
                    :timestamp="entry.plugin.timestamp"
                  ></time-machine>
                </v-flex>
              </v-layout>
            </v-container>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
      <v-card-title primary-title v-else>
        <v-flex class="subheading text-xs-center">There is no data yet</v-flex>
      </v-card-title>
      <v-card-actions></v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import DynamicLink from "./DynamicComponent";
import CopyToClipboard from "./CopyToClipboard";
import TimeMachine from "./TimeMachine";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "resource-detail",
  props: {
    grid_space: Number,
    resource: Object
  },
  components: { DynamicLink, CopyToClipboard, TimeMachine },
  data: function() {
    return {
      active: 0,
      component_key: 0
    };
  },
  computed: {
    ...mapGetters("results", { getResult: "get" }),
    sorted_plugin_list: function() {
      let plugins = this.resource.plugins.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        }

        if (a.name < b.name) {
          return -1;
        }

        return 0;
      });

      let plugin_list = [];
      for (const [i, plugin] of plugins.entries()) {
        plugin_list.push({ index: i, plugin: plugin });
      }
      return plugin_list;
    }
  },
  methods: {
    ...mapActions(["LOAD_TAGS"]),
    ...mapActions("results", { clearResult: "clear", setScanOn: "setOn" })
  },
  watch: {
    resource: {
      //HACK: Again, to reload dynamic component when new data arrives
      // https://michaelnthiessen.com/how-to-watch-nested-data-vue
      deep: true,
      handler: function() {
        this.component_key += 1;
        this.clearResult();
      }
    }
  },
  beforeMount: function() {
    this.LOAD_TAGS();
  }
};
</script>
