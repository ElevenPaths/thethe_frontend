<template>
  <v-layout row pt-2 wrap class="subheading">
    <v-flex xs12>
      <v-layout v-if="timestamp" align-center justify-start fill-height>
        <v-flex mx-4 v-if="timemachine.length > 1">
          <v-layout>
            <v-slider
              v-model="current_timestamp"
              :tick-labels="tick_labels()"
              :max="timemachine.length - 1"
              ticks
              track-color="primary"
              class="caption"
              thumb-label="always"
            ></v-slider>
          </v-layout>

          <v-layout align-center>
            <v-flex xs2>
              <v-switch v-model="toggle_differ" label="diff"></v-switch>
            </v-flex>
            <v-flex xs8>
              <v-flex v-if="current_timestamp > 0">
                <v-btn flat icon color="primary" @click.stop="to_past">
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
              </v-flex>
              <v-flex>
                <chip-time-from-now :timestamp="timestamp"></chip-time-from-now>
              </v-flex>
              <v-flex v-if="current_timestamp < (timemachine.length - 1)">
                <v-btn flat icon color="primary" @click.stop="to_future">
                  <v-icon>mdi-arrow-right</v-icon>
                </v-btn>
              </v-flex>
            </v-flex>
          </v-layout>

          <v-flex v-if="toggle_differ && current_timestamp != 0" xs12>
            <differ
              :plugin_name="plugin"
              :resource_id="resource"
              :timestamp_index="current_timestamp"
            ></differ>
          </v-flex>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>


<script>
import ChipTimeFromNow from "./ChipTimeFromNow";
import Differ from "./Differ";

import { from_python_time } from "../utils/utils";

export default {
  name: "time-machine",
  props: ["resource", "timemachine", "plugin", "timestamp"],
  components: { ChipTimeFromNow, Differ },
  data() {
    return {
      current_timestamp: 0,
      toggle_differ: false
    };
  },
  methods: {
    tick_labels: function() {
      return Array.from(this.timemachine, elem =>
        from_python_time(elem.timestamp)
      );
    },

    to_future: function() {
      this.current_timestamp += 1;
      this.load();
    },

    to_past: function() {
      this.current_timestamp -= 1;
      this.load();
    },

    load: function() {
      let params = {
        resource_id: this.resource,
        plugin_name: this.plugin,
        timestamp_index: this.current_timestamp
      };
      this.$store.dispatch("lazy_plugin_results", params);
    }
  }
};
</script>
