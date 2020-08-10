<template>
  <v-flex>
    <v-text-field
      prepend-icon="search"
      clearable
      v-model="query"
      @change="do_query"
      @click:clear="clear"
      single-line
    ></v-text-field>
    <div class="text-xs-center">
      <v-bottom-sheet v-model="opened" inset>
        <v-flex>
          <v-card v-if="results.length > 0">
            <v-card-title>
              <v-flex text-xs-left subheading class="font-weight-bold">Search results</v-flex>
            </v-card-title>
            <v-divider></v-divider>
            <v-flex scrollable v-if="results.length > 0">
              <v-card-text v-for="result in results" :key="result._id">
                <v-layout align-center justify-center>
                  <v-flex xs1>
                    <v-icon>{{ icon(result.type) }}</v-icon>
                  </v-flex>
                  <v-flex text-xs-left class="font-weight-bold text-truncate">
                    <span>{{highlight_name(result.name).head}}</span>
                    <span style="color:red">{{highlight_name(result.name).highlight}}</span>
                    <span>{{highlight_name(result.name).tail}}</span>
                    <v-flex text-xs-left class="font-weight-regular">
                      <span
                        v-for="project in result.projects"
                        :key="project._id"
                      >{{ project.name }}&nbsp;</span>
                    </v-flex>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-flex>
          </v-card>
          <v-card v-else>
            <v-card-title>
              <v-flex text-xs-left subheading class="font-weight-bold">No results</v-flex>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-bottom-sheet>
    </div>
  </v-flex>
</template>

<script>
import { api_call } from "../utils/api";

const MIN_CHARS_SEARCH = 3;

export default {
  name: "GlobalSearchBar",
  data: function() {
    return {
      query: "",
      results: [],
      opened: false
    };
  },
  methods: {
    highlight_name(name) {
      let head = "";
      let highlight = "";
      let tail = "";

      let index = name.indexOf(this.query);

      head = name.slice(0, index);
      highlight = name.slice(index, index + this.query.length);
      tail = name.slice(index + highlight.length);

      return { head: head, highlight: highlight, tail: tail };
    },
    icon: function(type) {
      switch (type) {
        case "ip":
          return "mdi-ip-network";
        case "domain":
          return "mdi-dns-outline";
        case "url":
          return "mdi-spider-web";
        case "email":
          return "mdi-email";
        case "hash":
          return "mdi-pound";
        case "username":
          return "mdi-account";
        default:
          return "";
      }
    },
    clear: function() {
      this.results = [];
      this.opened = false;
      this.$emit("clear");
    },
    do_query: function() {
      if (this.query && this.query.length >= MIN_CHARS_SEARCH) {
        let params = { url: "/api/search", query: this.query };
        this.$emit("searching", true);
        api_call(params)
          .then(resp => {
            let results = [];
            resp.data.map(resource => {
              results.push({
                _id: resource._id.$oid,
                name: resource.canonical_name,
                type: resource.resource_type,
                projects: resource.projects.map(
                  project =>
                    (project = { _id: project._id.$oid, name: project.name })
                )
              });
              this.results = results;
            });
          })
          .then(_ => this.$emit("searchresults", this.results))
          .then(_ => (this.opened = true))
          .catch(err => {
            console.log(err);
            this.$notify({
              title: "Error",
              text: err.data.error_message,
              type: "error"
            });
          });
      } else {
        this.$emit("searching", false);
      }
    }
  }
};
</script>

<style scoped>
.scrollable {
  max-height: 500px;
  overflow-y: auto;
}
</style>