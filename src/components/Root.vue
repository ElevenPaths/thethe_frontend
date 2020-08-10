<template>
  <v-app :dark="true">
    <v-progress-linear v-if="is_loading" :indeterminate="true"></v-progress-linear>
    <v-toolbar class="grey darken-3" dark flat dense>
      <!-- <v-toolbar-title class="light-grey--text">TheehT</v-toolbar-title> -->
      <v-layout align-center justify-center>
        <v-flex text-xs-left>
          <img src="static/images/thethe_big.png" height="36" width="100" />
        </v-flex>
        <v-spacer />
        <v-flex xs2 :class="{ 'pr-3': !is_project_opened}">
          <global-search-bar></global-search-bar>
        </v-flex>
        <v-flex shrink v-if="is_project_opened">
          <v-chip label color="primary" class="ma-2 title">{{ get_opened_project.name }}</v-chip>
        </v-flex>
        <v-flex shrink>
          <v-badge v-if="runningTasks.length > 0" class="mr-3 ml-1" overlap top color="red">
            <span slot="badge">{{ runningTasks.length }}</span>
            <v-avatar size="28">
              <tasks></tasks>
            </v-avatar>
          </v-badge>
        </v-flex>
      </v-layout>

      <v-menu offset-y dark>
        <template v-slot:activator="{ on }">
          <v-avatar size="36" color="#666666" v-on="on">
            <v-icon dark>mdi-account-circle-outline</v-icon>
          </v-avatar>
        </template>
        <v-list class="text-lg-left">
          <v-list-tile>
            <v-list-tile-avatar>
              <v-icon color="white">mdi-account</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                <v-flex class="font-weight-bold">{{me.username}}</v-flex>
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider v-if="is_project_opened"></v-divider>

          <v-list-tile v-if="is_project_opened" @click="switch_project">
            <v-list-tile-avatar>
              <v-icon>eject</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Change project</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider />

          <v-list-tile class="caption" @click.stop="show_apikeys_f(true)">
            <api-keys :show="show_apikeys" @apikeys-closed="show_apikeys=false" />

            <v-list-tile-avatar>
              <v-icon>mdi-key</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>API Keys</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider />
          <v-list-tile class="caption" @click.stop="show_tag_manager=true">
            <tag-manager :show="show_tag_manager" @close="show_tag_manager=false" />

            <v-list-tile-avatar>
              <v-icon>mdi-tag</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Tags</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider />

          <v-list-tile class="caption" @click.stop="show_change_password_dialog(true)">
            <change-password-dialog
              :show="show_change_password"
              @change-password-closed="show_change_password_dialog(false)"
            />

            <v-list-tile-avatar>
              <v-icon>mdi-textbox-password</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Change password</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider />

          <v-list-tile class="caption" @click.stop="about_dialog=true">
            <about-dialog :show="about_dialog" @close="about_dialog=false" />

            <v-list-tile-avatar>
              <v-icon>info</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>About</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider />

          <v-list-tile class="caption" @click="logout">
            <v-list-tile-avatar>
              <v-icon>logout</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Logout</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-container fluid grid-list-lg pt-1 px-0>
      <div v-if="!is_project_opened">
        <project-selector />
      </div>
      <v-flex v-else>
        <v-tabs v-model="active" slider-color="red">
          <v-tab>
            NETWORK
            <v-chip small>{{ get_resources("ip").length }}</v-chip>
          </v-tab>
          <v-tab>
            DOMAIN
            <v-chip small>{{ get_resources("domain").length }}</v-chip>
          </v-tab>
          <v-tab>
            URL
            <v-chip small>{{ get_resources("url").length }}</v-chip>
          </v-tab>
          <v-tab>
            HASH
            <v-chip small>{{ get_resources("hash").length }}</v-chip>
          </v-tab>
          <v-tab>
            EMAIL
            <v-chip small>{{ get_resources("email").length }}</v-chip>
          </v-tab>
          <v-tab>
            USERNAME
            <v-chip small>{{ get_resources("username").length }}</v-chip>
          </v-tab>
          <v-spacer />
          <v-tab>ANALYSIS</v-tab>
          <v-tabs-items>
            <v-tab-item>
              <v-layout wrap>
                <v-flex>
                  <resource-listing
                    :sortcriteria="sort_ip_addresses"
                    :headers="ip_table_headers"
                    resource-type="ip"
                    :grid_space="3"
                  >
                    <template v-slot:title>IP Address</template>
                  </resource-listing>
                </v-flex>
              </v-layout>
            </v-tab-item>
            <v-tab-item>
              <v-layout wrap>
                <v-flex>
                  <resource-listing
                    resource-type="domain"
                    :headers="domain_table_headers"
                    :grid_space="3"
                  >
                    <template v-slot:title>Domains</template>
                  </resource-listing>
                </v-flex>
              </v-layout>
            </v-tab-item>
            <v-tab-item>
              <v-layout row wrap>
                <v-flex>
                  <resource-listing
                    resource-type="url"
                    :headers="url_table_headers"
                    :grid_space="4"
                  >
                    <template v-slot:title>URLs</template>
                  </resource-listing>
                </v-flex>
              </v-layout>
            </v-tab-item>
            <v-tab-item>
              <v-layout row wrap>
                <v-flex>
                  <resource-listing
                    resource-type="hash"
                    :headers="hash_table_headers"
                    :grid_space="4"
                  >
                    <template v-slot:title>Hashes</template>
                  </resource-listing>
                </v-flex>
              </v-layout>
            </v-tab-item>
            <v-tab-item>
              <v-layout row wrap>
                <v-flex>
                  <resource-listing
                    resource-type="email"
                    :headers="email_table_headers"
                    :grid_space="3"
                  >
                    <template v-slot:title>Emails</template>
                  </resource-listing>
                </v-flex>
              </v-layout>
            </v-tab-item>
            <v-tab-item>
              <v-layout row wrap>
                <v-flex>
                  <resource-listing
                    resource-type="username"
                    :headers="username_table_headers"
                    :grid_space="3"
                  >
                    <template v-slot:title>Usernames</template>
                  </resource-listing>
                </v-flex>
              </v-layout>
            </v-tab-item>
            <!-- Analysis -->
            <v-tab-item lazy>
              <v-flex offset-lg1 lg10>
                <simple-vis-network />
              </v-flex>
              <v-flex class="white--text" title>Planned feature. Stay tuned.</v-flex>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-flex>
      <multiple-resource-input v-if="is_project_opened" />
    </v-container>
    <notifications position="bottom right" :ignore-duplicates="true" />
    <div class="logo">
      <img :src="require('@/assets/11p_logo.png')" width="100px" />
    </div>
    <div class="version">v{{ APP_VERSION }}</div>
  </v-app>
</template>

<script>
import AboutDialog from "./AboutDialog";
import ApiKeys from "./ApiKeys";
import ChangePasswordDialog from "./ChangePasswordDialog";
import GlobalSearchBar from "./GlobalSearchBar";
import MultipleResourceInput from "./MultipleResourceInput";
import ProjectSelector from "./ProjectSelector";
import ResourceListing from "./ResourceListing";
import SimpleVisNetwork from "./SimpleVisNetwork";
import TagManager from "./TagManager";
import Tasks from "./Tasks";

import { mapGetters } from "vuex";
import compare_ip_addreses from "../utils/sort";

export default {
  components: {
    AboutDialog,
    TagManager,
    ResourceListing,
    ProjectSelector,
    GlobalSearchBar,
    MultipleResourceInput,
    SimpleVisNetwork,
    ApiKeys,
    Tasks,
    ChangePasswordDialog
  },

  data: function() {
    return {
      APP_VERSION: require("../../package.json").version,

      active: null,
      show_apikeys: false,
      show_change_password: false,
      update_interval: null,
      about_dialog: false,
      show_tag_manager: false,

      ip_table_headers: [
        {
          text: "IP",
          value: "address"
        }
      ],
      domain_table_headers: [
        {
          text: "DOMAIN",
          value: "domain"
        }
      ],
      email_table_headers: [
        {
          text: "EMAIL",
          value: "email"
        }
      ],
      username_table_headers: [
        {
          text: "USERNAME",
          value: "username"
        }
      ],
      hash_table_headers: [
        {
          text: "HASH",
          value: "hash"
        },
        {
          text: "TYPE",
          value: "hash_type"
        }
      ],
      url_table_headers: [
        {
          text: "URL",
          value: "full_url"
        }
      ],
      sort_ip_addresses: compare_ip_addreses
    };
  },

  methods: {
    logout: function() {
      clearInterval(this.update_interval);
      this.$store
        .dispatch("AUTH_LOGOUT")
        .then(() => {
          this.$store.dispatch("RESET_PROJECT");
        })
        .then(() => {
          this.$router.push("/login");
        });
    },

    show_apikeys_f: function(show) {
      this.show_apikeys = show;
    },

    show_change_password_dialog: function(show) {
      this.show_change_password = show;
    },

    //TODO: Before switch project check if there are pending operations
    switch_project: function() {
      this.$store.dispatch("RESET_PROJECT");
    }
  },

  computed: {
    ...mapGetters([
      "get_opened_project",
      "is_project_opened",
      "is_authenticated",
      "is_loading",
      "get_resources",
      "me"
    ]),
    username: function() {
      return this.$store.getters["username"];
    },
    runningTasks: function() {
      return this.$store.state.resourcelist.running;
    }
  },

  mounted: function() {
    let self = this;
    this.update_interval = setInterval(function() {
      if (self.is_authenticated && self.is_project_opened) {
        self.$store.dispatch("update").catch();
      }
    }, 10000);
  },

  beforeMount: function() {
    if (!this.$store.getters["is_authenticated"]) {
      this.$router.push("/login");
    }
  }
};
</script>

<style>
.selected {
  background-color: #666666;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgb(48, 47, 47);
  box-shadow: inset 0 0 6px rgb(46, 31, 31);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgb(95, 94, 94);
  box-shadow: inset 0 0 6px rgb(117, 115, 115);
}

div.logo {
  position: fixed;
  bottom: 0;
  padding-bottom: 4px;
  padding-left: 10px;
}

div.version {
  position: fixed;
  bottom: 0;
  padding-bottom: 4px;
  padding-right: 10px;
  align-self: flex-end;
  color: white;
  font-size: x-small;
}
</style>
