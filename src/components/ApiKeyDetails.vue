<template>
  <v-layout row>
    <v-flex v-if="plugin">
      <v-card>
        <v-card-title class="title font-weight-bold">
          <v-flex text-xs-left>{{ plugin.name }}</v-flex>
          <v-flex text-xs-right>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <SecLink :url="plugin.apikey_doc">
                  <v-icon color="blue" v-on="on">help</v-icon>
                </SecLink>
              </template>
              <span>Need API keys for this plugin?</span>
            </v-tooltip>
          </v-flex>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-flex text-xs-left>{{ plugin.description }}</v-flex>
          <v-container>
            <v-layout
              text-xs-left
              v-for="apikey in plugin.apikeys"
              :key="apikey.name"
              column
              justify-center
            >
              <v-flex xs12 pb-2>
                <v-label>{{ apikey.name }}</v-label>
              </v-flex>
              <v-flex xs12>
                <v-layout align-center>
                  <v-text-field
                    @change="update_field(apikey.name, $event)"
                    :value="apikey.value"
                    outline
                    :type="passwordized? 'password':'text'"
                  ></v-text-field>
                  <copy-to-clipboard :text_to_copy="apikey.value"></copy-to-clipboard>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex v-else>Select a plugin</v-flex>
  </v-layout>
</template>

<script>
import SecLink from "./SecLink";
import CopyToClipboard from "./CopyToClipboard";

export default {
  components: { SecLink, CopyToClipboard },
  props: ["plugin", "private"],
  data() {
    return {};
  },
  computed: {
    passwordized: function() {
      return this.private;
    }
  },
  methods: {
    update_field: function(apikey_name, apikey_new_value) {
      let apikey = this.plugin.apikeys.find(e => e.name === apikey_name);
      apikey.value = apikey_new_value.trim();
      this.$emit("change", { name: apikey_name, value: apikey_new_value });
    }
  }
};
</script>
