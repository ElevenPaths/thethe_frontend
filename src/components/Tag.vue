<template>
  <v-chip
    :color="color"
    :text-color="textColor"
    @click.stop="$emit('click')"
    :close="closable"
    @input="$emit('close')"
  >
    <v-avatar v-if="icon">
      <v-icon>{{ icon }}</v-icon>
    </v-avatar>
    <v-flex class="font-weight-bold">
      <slot></slot>
    </v-flex>
  </v-chip>
</template>

<script>
export default {
  name: "tag",
  components: {},
  props: {
    color: { type: String, default: "blue" },
    textColor: { type: String, default: "white" },
    icon: { type: String, default: "" },
    closable: { type: Boolean, default: false }
  },

  data() {
    return {};
  }
};
</script>
