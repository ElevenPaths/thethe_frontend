<template>
  <v-layout row>
    <v-dialog v-model="dialog" width="50%" persistent>
      <template v-slot:activator="{ on }">
        <v-btn fab bottom right color="blue" dark fixed v-on="on">
          <v-icon>add</v-icon>
        </v-btn>
      </template>
      <v-flex xs12>
        <v-card v-if="!validate">
          <v-card-title>
            <v-flex text-xs-left title>Resource input</v-flex>
            <v-flex text-xs-right>
              <the-button
                round
                small
                color="red"
                @click="[dialog=false, cleanup()]"
                icon="mdi-close"
              >Close dialog</the-button>
            </v-flex>
          </v-card-title>
          <v-label
            v-if="preprocess_resources !== undefined"
          >{{ preprocess_resources.length }} resources in total</v-label>
          <v-divider />
          <v-card-text>
            <v-layout wrap>
              <v-flex xs12>
                <v-form ref="resource_form">
                  <v-textarea
                    ref="resource_list_textarea"
                    v-model="resource_list_model"
                    box
                    rows="1"
                    class="scroll-y"
                    :auto-grow="true"
                    label="Paste or enter resources"
                    style="max-height: 600px"
                  />
                </v-form>
              </v-flex>
              <v-flex xs12>
                <v-checkbox v-model="are_usernames" label="Parse as usernames"></v-checkbox>
              </v-flex>
              <v-flex xs12>
                <v-divider />
              </v-flex>
              <v-flex pt-1>
                <the-button color="primary" @click="validate=true">Validate</the-button>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
        <v-card v-else>
          <v-card-title class="title">
            <v-flex text-xs-left title>Detected resources</v-flex>
            <v-flex text-xs-right>
              <the-button
                round
                small
                color="red"
                @click="[dialog=false, cleanup()]"
                icon="mdi-close"
              >Close dialog</the-button>
            </v-flex>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text v-if="preprocess_resources !== undefined && preprocess_resources.length > 0">
            <v-container class="scroll-y" style="max-height: 600px">
              <v-list avatar>
                <v-list-tile v-for="item in preprocess_resources" :key="item.resource">
                  <v-list-tile-avatar>
                    <div class="text-xs-center">
                      <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                          <v-chip
                            :color="item.color"
                            label
                            class="font-weight-bold"
                            v-on="on"
                          >{{ item.type }}</v-chip>
                        </template>
                        <v-list>
                          <v-list-tile
                            v-for="(type, index) in types"
                            :key="index"
                            @click="patch_type(item.resource, type)"
                          >
                            <v-list-tile-title>{{ type }}</v-list-tile-title>
                          </v-list-tile>
                        </v-list>
                      </v-menu>
                    </div>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title body-2>
                      <v-flex offset-xs1 text-truncate>{{ item.resource }}</v-flex>
                    </v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-flex pl-1>
                      <the-button color="red" @click="unlisted.push(item.resource)">Remove</the-button>
                    </v-flex>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-container>
          </v-card-text>
          <v-card-text v-else>
            <v-flex subheading>No resources to upload</v-flex>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-layout>
              <v-flex v-if="!scannedReady">
                <the-button color="primary" @click="[validate = false, unlisted=[]]">Back</the-button>
              </v-flex>
              <v-flex v-if="preprocess_resources !== undefined">
                <the-button
                  :disabled="preprocess_resources.length === 0"
                  color="green"
                  @click="[send(), cleanup()]"
                >Upload {{ preprocess_resources.length }} {{ preprocess_resources.length === 1? 'item' : 'items' }}</the-button>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-dialog>
  </v-layout>
</template>

<script>
import TheButton from "./TheButton";

import validator from "validator";
import { extractIOC } from "ioc-extractor";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "MultipleResourceInput",
  components: { TheButton },
  data() {
    return {
      are_usernames: false,
      resource_list_model: "",
      validate: false,
      dialog: false,
      user_type_patch_list: [],
      unlisted: [],

      //TODO: These types are hardcoded -> change to dynamic
      types: ["ip", "email", "url", "domain", "hash", "username"]
    };
  },
  watch: {
    scannedReady: {
      handler: function(new_value, old_value) {
        if (new_value) {
          this.dialog = true;
          this.resource_list_model = this.getScanned(this.scannedName).result;
          this.validate = true;
        }
      }
    }
  },
  computed: {
    ...mapGetters("results", {
      scannedReady: "ready",
      scannedName: "scanned",
      getScanned: "get"
    }),

    preprocess_resources() {
      if (!this.resource_list_model) return;

      if (this.are_usernames) {
        let resources = [];
        this.resource_list_model
          .split("\n")
          .filter(entry => entry.trim().length > 0)
          .map(entry =>
            resources.push({
              resource: entry,
              type: "username",
              color: this.colorize_type("username")
            })
          )
          .sort();
        return resources;
      }

      // From scan we have an object with <type_of_ioc>:[iocs]
      // We need a list of [{ resource:ioc, type: one_of_this.types, color: one_of_this.colorize_type }]
      // Our output must: scanned, classified, unique, filtered, patched, ordered

      // Scanned
      let values = this.scan(this.resource_list_model);

      // Classified
      let classified_resources = [];

      values.domains.map(elem =>
        classified_resources.push({
          resource: elem,
          type: "domain",
          color: this.colorize_type("domain")
        })
      );

      values.ipv4s.map(elem =>
        classified_resources.push({
          resource: elem,
          type: "ip",
          color: this.colorize_type("ip")
        })
      );

      values.emails.map(elem =>
        classified_resources.push({
          resource: elem,
          type: "email",
          color: this.colorize_type("email")
        })
      );

      values.urls.map(elem =>
        classified_resources.push({
          resource: elem,
          type: "url",
          color: this.colorize_type("url")
        })
      );

      let hashes = ["md5s", "sha1s", "sha256s", "sha512s"];
      hashes.map(hash =>
        values[hash].map(elem =>
          classified_resources.push({
            resource: elem,
            type: "hash",
            color: this.colorize_type("hash")
          })
        )
      );

      // Sort
      classified_resources = classified_resources.sort((a, b) =>
        a.type.localeCompare(b.type)
      );

      // Filter
      classified_resources = classified_resources.filter(
        elem => !this.unlisted.includes(elem.resource)
      );

      // Patch type
      this.user_type_patch_list.map(patch => {
        let e = classified_resources.find(
          elem => elem.resource === patch.resource
        );

        if (e) {
          e.type = patch.type;
          e.color = this.colorize_type(e.type);
        }
      });

      return classified_resources;
    }
  },
  methods: {
    ...mapActions("results", { scannedOff: "setOff" }),

    cleanup: function() {
      this.dialog = false;
      this.unlisted = [];
      this.validate = false;
      this.resource_list_model = "";
      this.are_usernames = false;
      this.scannedOff();
    },
    scan: function(tx) {
      return extractIOC(tx);
    },
    colorize_type(type) {
      switch (type) {
        case "ip":
          return "green";
        case "email":
          return "blue";
        case "url":
          return "orange";
        case "domain":
          return "indigo";
        case "hash":
          return "purple";
        case "username":
          return "red";
        default:
          return "black";
      }
    },
    send() {
      this.preprocess_resources.forEach(new_resource => {
        let payload = {
          resource_name: new_resource.resource,
          resource_type: new_resource.type
        };
        this.$store.dispatch("add_new_resource", payload);
      });
    },
    patch_type(resource, type) {
      // Check if user already patched the type
      this.user_type_patch_list.forEach(elem => {
        if (elem.resource === resource) {
          elem.type = type;
          return;
        }
      });
      // New patch from user
      this.user_type_patch_list.push({ resource: resource, type: type });
    }
  }
};
</script>

<style scoped>
.v-list {
  overflow-x: hidden;
}

.v-btn--bottom:not(.v-btn--absolute) {
  bottom: 50px;
}
</style>
