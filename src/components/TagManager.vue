<template>
  <v-dialog v-model="show" persistent max-width="45%">
    <v-card>
      <v-card-title>
        <v-flex class="font-weight-bold" text-xs-left subheading>Tag manager</v-flex>
        <v-flex text-xs-right>
          <the-button
            small
            round
            color="red"
            @click="[$emit('close'),clear(),add_tag=false]"
            icon="mdi-close"
          >Close dialog</the-button>
        </v-flex>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text v-if="tags.length > 0">
        <v-container grid-list-md text-xs-center>
          <v-layout wrap>
            <v-flex v-for="tag in tags" :key="tag._id" shrink>
              <tag
                :color="tag.color"
                :icon="tag.icon"
                closable
                @close="[delete_dialog=true, tag_for_deletion=tag._id]"
              >{{ tag.name }}</tag>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-text v-else>
        <v-container grid-list-md text-xs-center>
          <v-layout>
            <v-flex>There is no tags yet</v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-text v-if="add_tag">
        <v-container>
          <v-layout column>
            <v-flex>
              <v-form>
                <v-layout row wrap>
                  <v-flex text-xs-left xs12 class="font-weight-bold">Name</v-flex>
                  <v-flex xs12 pt-3>
                    <v-text-field maxlength="64" counter="64" v-model="tag_name" outline clearable></v-text-field>
                  </v-flex>
                  <v-flex v-if="tag_name" py-3>
                    <v-flex text-xs-left xs12 class="font-weight-bold">Color</v-flex>
                    <v-flex xs12>
                      <v-btn
                        v-for="color in tag_colors"
                        :key="color"
                        :value="color"
                        fab
                        dark
                        small
                        :color="color"
                        @click.stop="tag_color = color"
                      ></v-btn>
                    </v-flex>
                  </v-flex>
                  <v-flex v-if="tag_color && tag_name">
                    <v-flex text-xs-left xs12 class="font-weight-bold">Icon (optional)</v-flex>
                    <v-flex xs12 pt-3>
                      <v-btn
                        flat
                        icon
                        v-for="icon in tag_icons"
                        :key="icon"
                        @click.stop="tag_icon = icon"
                      >
                        <v-icon>{{ icon }}</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-flex>
            <v-divider></v-divider>
            <v-layout v-if="tag_name" align-center justify-center py-3 wrap>
              <v-flex text-xs-left xs12 class="font-weight-bold">Preview</v-flex>
              <v-flex xs12>
                <tag :color="tag_color" :icon="tag_icon">{{ tag_name }}</tag>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-layout>
          <v-flex v-if="add_tag && tag_name && tag_color">
            <the-button
              color="green"
              @click="CREATE_TAG({name: tag_name, color: tag_color, icon: tag_icon})"
            >Create</the-button>
          </v-flex>
          <v-flex v-if="add_tag">
            <the-button color="red" icon="clear" @click="[add_tag=false,clear()]">Cancel</the-button>
          </v-flex>
          <v-flex v-else>
            <the-button color="green" @click="add_tag=true">Create</the-button>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
    <delete-dialog
      title="Are you sure to delete this tags?"
      text="All references to this tag will be deleted too"
      :show="delete_dialog"
      @dismiss="delete_dialog = !delete_dialog"
      @dodelete="[delete_dialog = !delete_dialog, DELETE_TAG(tag_for_deletion)]"
    ></delete-dialog>
  </v-dialog>
</template>

<script>
import TheButton from "./TheButton";
import Tag from "./Tag";
import DeleteDialog from "./DeleteDialog";

import { mapActions } from "vuex";

export default {
  name: "tag-manager",
  components: { TheButton, Tag, DeleteDialog },
  props: { show: { type: Boolean, default: false } },

  data() {
    return {
      delete_dialog: false,
      tag_for_deletion: null,
      add_tag: false,
      tag_name: "",
      tag_color: "",
      tag_colors: [
        "purple",
        "red",
        "pink",
        "orange",
        "indigo",
        "blue",
        "cyan",
        "green",
        "teal",
        "light-blue"
      ],
      tag_icon: "",
      tag_icons: [
        "android",
        "warning",
        "bug_report",
        "build",
        "dns",
        "extension",
        "favorite",
        "fingerprint",
        "help",
        "grade",
        "home",
        "http",
        "https",
        "info",
        "label",
        "language",
        "mediation",
        "lock_open",
        "pan_tool",
        "outlet",
        "payment",
        "query_builder",
        "print",
        "privacy_tip",
        "room",
        "search",
        "support",
        "verified",
        "verified_user",
        "visibility",
        "work",
        "videocam",
        "call",
        "sentiment_satisfied_alt",
        "vpn_key"
      ]
    };
  },
  methods: {
    ...mapActions(["LOAD_TAGS", "DELETE_TAG", "CREATE_TAG"]),
    clear: function() {
      this.tag_color = "";
      this.tag_icon = "";
      this.tag_name = "";
    }
  },
  computed: {
    tags: function() {
      return this.$store.getters.get_tags;
    }
  },
  mounted: function() {
    this.LOAD_TAGS();
  }
};
</script>
