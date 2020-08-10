<template>
  <v-card v-show="has_tags">
    <v-card-text>
      <v-container>
        <v-layout wrap v-if="has_tags">
          <v-flex v-for="tag in resource_tags" :key="tag._id" shrink>
            <tag :color="tag.color" :icon="tag.icon">{{ tag.name }}</tag>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-dialog v-model="show" persistent max-width="40%">
      <v-flex v-if="resource">
        <v-card>
          <v-card-title class="subheading">
            <v-layout align-center>
              <v-flex text-xs-left class="text-truncate font-weight-bold">Tags assignment</v-flex>
              <v-flex shrink text-xs-right>
                <the-button
                  round
                  small
                  color="red"
                  @click="$emit('close')"
                  icon="mdi-close"
                >Close dialog</the-button>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-flex text-xs-left>Available tags</v-flex>
            <v-container grid-list-xs v-if="available_tags.length > 0">
              <v-layout align-center wrap>
                <v-flex v-for="tag in available_tags" :key="tag._id" shrink>
                  <tag
                    :color="tag.color"
                    :icon="tag.icon"
                    @click="ADD_TAG_TO_RESOURCE({resource_id: resource._id, tag_id: tag._id})"
                  >{{ tag.name }}</tag>
                </v-flex>
              </v-layout>
            </v-container>
            <v-container grid-list-md text-xs-center v-else>
              <v-layout wrap>
                <v-flex>There are not tags yet</v-flex>
              </v-layout>
            </v-container>
            <v-divider></v-divider>
            <v-flex pt-2 text-xs-left>
              Assigned tags for
              <span class="font-weight-bold">{{ resource.canonical_name }}</span>
            </v-flex>
            <v-container grid-list-md v-if="resource_tags.length > 0">
              <v-layout align-center wrap>
                <v-flex v-for="tag in resource_tags" :key="tag._id" shrink>
                  <tag
                    :color="tag.color"
                    :icon="tag.icon"
                    closable
                    @close="REMOVE_TAG_FROM_RESOURCE({resource_id: resource._id, tag_id: tag._id})"
                  >{{ tag.name }}</tag>
                </v-flex>
              </v-layout>
            </v-container>
            <v-container grid-list-md text-xs-center v-else>
              <v-layout wrap>
                <v-flex>No tags assigned</v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-layout>
              <v-flex>
                <the-button color="blue" icon="mdi-tag" @click="tag_manager=true">Manage tags</the-button>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex v-else>Select a user</v-flex>
    </v-dialog>
    <tag-manager :show="tag_manager" @close="tag_manager=false"></tag-manager>
  </v-card>
</template>

<script>
import TheButton from "./TheButton";
import DeleteDialog from "./DeleteDialog";
import TagManager from "./TagManager";
import Tag from "./Tag";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "tags-ng",
  components: { TheButton, DeleteDialog, Tag, TagManager },
  props: ["resource_id", "show"],

  data() {
    return {
      tag_manager: false
    };
  },
  computed: {
    ...mapGetters(["get_tags", "get_tag", "get_resource"]),
    resource: function() {
      return this.get_resource(this.resource_id);
    },
    resource_tags: function() {
      if (this.resource.hasOwnProperty("tags")) {
        return this.resource.tags
          .map(tag => this.get_tag(tag))
          .filter(tag => tag !== undefined && tag.hasOwnProperty("_id"));
      } else {
        return [];
      }
    },
    available_tags: function() {
      return this.get_tags.filter(tag => !this.resource_tags.includes(tag));
    },
    has_tags: function() {
      if (this.resource) {
        if (typeof this.resource.tags !== "undefined" ? true : false) {
          if (this.resource.tags.length > 0) {
            return true;
          }
        } else {
          return false;
        }
      }
    }
  },
  methods: {
    ...mapActions([
      "LOAD_TAGS",
      "ADD_TAG_TO_RESOURCE",
      "REMOVE_TAG_FROM_RESOURCE"
    ])
  },
  watch: {
    show: function(newValue, oldValue) {
      if (newValue) {
        this.LOAD_TAGS();
      }
    }
  }
};
</script>
