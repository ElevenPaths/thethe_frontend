<template>
  <v-app id="wait" :dark="true">
    <v-content>
      <v-container fluid fill-height>
        <v-layout xs4 column>
          <v-flex class="display-2">Server is not responding...</v-flex>
          <v-flex
            class="display-1"
          >If you just started thethe the server should be warming up. Wait.</v-flex>
          <v-flex class="display-1">
            If you updated thethe your token is not valid now. Go to
            <a href="/login">login</a>
          </v-flex>
          <v-flex class="display-1">
            If none of this works look at
            <pre>docker log --tail=100 thethe_server</pre>to inspect logs (do not hesitate to contact us!).
          </v-flex>
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
    const delay = 10000;
    this.timer = setTimeout(() => {
      this.$router.push("/");
    }, delay);
  }
};
</script>