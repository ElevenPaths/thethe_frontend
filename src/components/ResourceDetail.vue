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
            <dynamic-link :type="entry.plugin.name" :data="entry.plugin" :key="component_key"></dynamic-link>
            <v-divider></v-divider>
            <v-layout v-if="entry.plugin.timestamp" align-center justify-start row fill-height wrap>
              <v-flex mx-4 v-if="entry.plugin.timemachine.length > 1">
                <v-slider
                  v-model="current_timestamp"
                  :tick-labels="tick_labels(entry.plugin.timemachine)"
                  :max="entry.plugin.timemachine.length - 1"
                  ticks
                  track-color="primary"
                  class="caption"
                  thumb-label="always"
                ></v-slider>
                <v-flex>
                  <chip-time-from-now :timestamp="entry.plugin.timestamp"></chip-time-from-now>
                </v-flex>
              </v-flex>
              <v-flex v-else>
                <chip-time-from-now :timestamp="entry.plugin.timestamp"></chip-time-from-now>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex>
                <differ
                  v-if="current_timestamp !== 0"
                  :plugin_name="entry.plugin.name"
                  :resource_id="resource._id"
                  :index="current_timestamp"
                ></differ>
              </v-flex>
            </v-layout>
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
import ChipTimeFromNow from "./ChipTimeFromNow";
import CopyToClipboard from "./CopyToClipboard";
import Differ from "./Differ";

import { from_python_time } from "../utils/utils";

export default {
  name: "resource-detail",
  props: {
    grid_space: Number,
    resource: Object
  },
  components: { DynamicLink, ChipTimeFromNow, CopyToClipboard, Differ },
  data: function() {
    return { active: 0, component_key: 0, current_timestamp: 0 };
  },
  computed: {
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
    from_python_time: from_python_time,

    tick_labels: function(timemachine) {
      return Array.from(timemachine, elem => from_python_time(elem.timestamp));
    },

    get_timestamp: function() {
      try {
        return entry.plugin.timemachine[current_timestamp].timestamp;
      } catch {
        console.log("Error getting timestamp from timemachine array");
        console.log(this.current_timestamp);
        console.log(entry);
      }
    }
  },
  watch: {
    resource: {
      //HACK: Again, to reload dynamic component when new data arrives
      // https://michaelnthiessen.com/how-to-watch-nested-data-vue
      deep: true,
      handler: function() {
        this.component_key += 1;
      }
    },
    current_timestamp: {
      handler: function() {
        let params = {
          resource_id: this.resource._id,
          plugin_name: this.sorted_plugin_list[this.active].plugin.name,
          timestamp_index: this.current_timestamp
        };
        this.$store.dispatch("lazy_plugin_results", params);
      }
    }
  }
};
</script>
