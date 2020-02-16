<template>
  <div class="text-xs-center">
    <v-bottom-sheet v-model="sheet" inset>
      <template v-slot:activator>
        <slot></slot>
      </template>
      <v-list>
        <v-subheader>
          <span>
            <b>Available plugins</b>&nbsp; (click on a entry to launch
            task)
          </span>
        </v-subheader>
        <v-divider></v-divider>
        <v-list-tile v-for="plugin in plugin_list" :key="plugin.name" avatar two-line>
          <v-layout>
            <v-btn
              class="text-lowercase"
              block
              large
              flat
              @click="
                launch(plugin);
                sheet = false;
              "
            >
              <v-list-tile-content>
                <v-list-tile-title class="subheading font-weight-bold">
                  <v-layout>
                    {{
                    plugin.name
                    }}
                    <v-icon
                      v-if="!plugin.apikey_in_ddbb && plugin.api_key"
                      small
                      color="error"
                      dark
                      class="ml-1"
                    >mdi-alert</v-icon>
                  </v-layout>
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  <v-layout>
                    <v-flex>{{ plugin.description }}</v-flex>
                  </v-layout>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <chip-time-from-now :timestamp="plugin.last_update"></chip-time-from-now>
              </v-list-tile-action>
            </v-btn>
          </v-layout>
        </v-list-tile>
        <v-divider></v-divider>
        <v-subheader>
          <v-flex>
            <v-icon color="error" style="margin: 0px 8px">warning</v-icon>
            <span style="padding: 0px 10px">
              <b>Needs API Key</b>
            </span>
          </v-flex>
        </v-subheader>
      </v-list>
    </v-bottom-sheet>
  </div>
</template>

<script>
import api_call from "../utils/api";
import { timestamp_diff_from_now } from "../utils/utils";

import ChipTimeFromNow from "./ChipTimeFromNow";

export default {
  name: "PluginSelector",
  components: { ChipTimeFromNow },
  props: { resource: Object },
  data() {
    return {
      sheet: false,
      plugin_list: []
    };
  },
  mounted: function() {
    this.get_related_plugins();
  },
  methods: {
    get_related_plugins: function() {
      let params = {
        url: "/api/get_related_plugins",
        resource_type: this.resource.resource_type
      };

      api_call(params)
        .then(resp => {
          this.plugin_list = resp.data;
        })
        .then(resp => this.update_pluginglist_dates());
    },

    loading: function(plugin) {
      this.$store.dispatch("loading", {
        _id: this.resource._id,
        resourceType: this.resource.resource_type,
        plugin: plugin
      });
    },

    launch: function(entry) {
      let params = {
        url: "/api/launch_plugin",
        resource_id: this.resource._id,
        resource_type: this.resource.resource_type,
        plugin_name: entry.name
      };

      this.loading(entry.name);
      api_call(params);
    },

    update_pluginglist_dates: function() {
      for (let plugin of this.plugin_list) {
        let match = this.resource.plugins.find(
          elem => elem.name.localeCompare(plugin.name) == 0
        );
        if (typeof match !== "undefined") {
          plugin.last_update = match.timestamp;
        } else {
          plugin.last_update = null;
        }
      }
    }
  },
  watch: {
    resource: {
      deep: true,
      handler: function() {
        this.update_pluginglist_dates();
      }
    }
  }
};
</script>
