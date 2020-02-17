<template>
  <v-card>
    <v-card-title class="headline">{{ title }}</v-card-title>
    <v-card-text>{{ text }}</v-card-text>
    <v-spacer></v-spacer>
    <v-card-actions>
      <v-flex>
        <v-btn color="green darken-1" flat @click.stop="dontdoit">No, dismiss</v-btn>
        <v-btn color="red darken-1" flat @click.stop="doit">Yes, do it</v-btn>
      </v-flex>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "differ",
  props: ["text-left", "text-right", "show"]
};
</script>
