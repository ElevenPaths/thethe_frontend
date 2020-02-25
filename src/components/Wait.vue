<template>
  <v-app id="wait" :dark="true">
    <v-content>
      <v-container fluid fill-height>
        <v-layout xs4 align-center justify-center column>
          <v-spacer></v-spacer>
          <v-flex>
            <v-img src="../../public/static/images/thethe_big.png" width="300px"></v-img>
          </v-flex>
          <v-flex class="display-3">Looks like the server is not responding</v-flex>
          <v-flex class="display-3">Wait...</v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      timer: ""
    };
  },
  mounted: function() {
    const delay = 5000;
    this.timer = setTimeout(() => {
      this.$router.push("/");
    }, delay);
  }
};
</script>