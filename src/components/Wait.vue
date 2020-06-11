<template>
  <v-app id="wait" :dark="true">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center wrap>
          <v-flex xs12>
            <v-progress-circular :width="3" :size="100" color="blue" indeterminate></v-progress-circular>
          </v-flex>
          <v-flex xs12 v-if="counter < 3">Waiting for server...</v-flex>
          <v-flex xs12 v-else>Server warmup is taking longer than expected...check logs</v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      timer: "",
      counter: 0
    };
  },
  mounted: function() {
    const delay = 10000;
    this.timer = setTimeout(() => {
      this.$router.push("/");
      this.counter += 1;
    }, delay);
  }
};
</script>