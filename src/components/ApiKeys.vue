<template>
  <v-dialog v-model="show" persistent max-width="75%">
    <v-card>
      <v-card-title class="headline">API Keys Management</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-layout>
          <v-flex xs3>
            <v-layout column>
              <v-flex>
                <v-switch v-model="only_without_keys" label="Key needed only"></v-switch>
              </v-flex>
              <v-divider></v-divider>
              <v-flex v-if="apikeys" scrollable>
                <v-list>
                  <v-list-tile
                    v-for="plugin in keys"
                    :key="plugin.name"
                    @click.stop="selected_plugin=plugin"
                  >
                    <v-list-tile-avatar>
                      <v-icon v-if="plugin.apikeys.some(e => !e.value)" color="red">warning</v-icon>
                      <v-icon v-else color="green">done</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>{{ plugin.name }}</v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-flex>
              <v-flex v-else class="font-weight-bold">No API Keys yet...</v-flex>
            </v-layout>
          </v-flex>
          <v-flex ml-2>
            <api-key-details :plugin="selected_plugin" :private="password" @change="update_key"></api-key-details>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-layout align-center justify-center row fill-height>
          <v-flex></v-flex>
          <v-flex>
            <v-layout>
              <v-flex>
                <the-button
                  color="yellow darken-1"
                  :disabled="!modified"
                  @click="send_apikeys(), $emit('apikeys-closed')"
                >upload</the-button>
              </v-flex>
              <v-flex>
                <the-button color="red darken-1" @click="close_dialog">Close</the-button>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex text-xs-right>
            <v-icon v-if="password" color="green" @click.stop="toggle_password">visibility_off</v-icon>
            <v-icon v-else color="red" @click.stop="toggle_password">visibility</v-icon>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
    <delete-dialog
      title="There are unsaved changes"
      text="Are you sure to close dialog?"
      :show="delete_dialog"
      @dismiss="delete_dialog = !delete_dialog"
      @dodelete="[modified=false, close_dialog()]"
    ></delete-dialog>
  </v-dialog>
</template>

<script>
import { api_call } from "../utils/api";
import ApiKeyDetails from "./ApiKeyDetails.vue";
import DeleteDialog from "./DeleteDialog";
import TheButton from "./TheButton";

export default {
  props: { show: Boolean },
  components: {
    ApiKeyDetails,
    DeleteDialog,
    TheButton
  },
  data() {
    return {
      apikeys: [],
      updated_keys: [],
      modified: false,
      selected_plugin: null,
      only_without_keys: false,
      password: true,
      delete_dialog: false
    };
  },
  computed: {
    keys: function() {
      this.selected_plugin = null;
      if (this.only_without_keys) {
        return this.apikeys.filter(
          e => e.apikeys.filter(ee => !ee.value).length > 0
        );
      }
      return this.apikeys;
    }
  },
  methods: {
    close_dialog() {
      this.password = true;
      if (this.modified) {
        this.delete_dialog = true;
      } else {
        this.delete_dialog = false;
        this.$emit("apikeys-closed");
      }
    },
    update_key(update) {
      this.modified = true;
      this.updated_keys.push(update);
    },
    toggle_password: function() {
      this.password = !this.password;
    },
    load_keys: function() {
      let params = {
        url: "/api/get_apikeys"
      };

      api_call(params)
        .then(resp => {
          resp.data.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (b.name > a.name) return -1;
            return 0;
          });
          this.apikeys = resp.data;
        })
        .catch(err => {
          this.$notify({
            title: "Error",
            text: err.data.error_message,
            type: "error"
          });
        });
    },
    send_apikeys: function() {
      var params = {
        url: "/api/upload_apikeys",
        entries: this.updated_keys
      };

      api_call(params)
        .then(resp => {
          this.$notify({
            title: "Info",
            text: resp.data.success_message
          });
          this.modified = false;
        })
        .catch(err => {
          this.$notify({
            title: "Error",
            text: err.data.error_message,
            type: "error"
          });
        });
    }
  },
  watch: {
    show: function(newValue, oldValue) {
      if (newValue) {
        this.only_without_keys = false;
        this.load_keys();
      }
    }
  }
};
</script>

<style scoped>
.v-list {
  max-height: 500px;
  overflow-y: auto;
}
</style>