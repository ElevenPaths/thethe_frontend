<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn
        :disabled="disabled"
        :small="small"
        :color="color"
        :icon="round"
        outline
        @click="$emit('click')"
      >
        <slot v-if="!round"></slot>
        <v-icon v-if="round && icon" :small="small" v-on="on">{{ icon }}</v-icon>
      </v-btn>
    </template>
    <span v-if="round">
      <slot></slot>
    </span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    icon: { type: String },
    color: { default: "info", type: String },
    small: { default: false, type: Boolean },
    round: { default: false, type: Boolean },
    disabled: { default: false, type: Boolean }
  },
  data() {
    return {};
  }
};
</script>