<template>
  <v-progress-circular
    :rotate="90"
    :size="100"
    :width="15"
    :value="getPercentage()"
    :color="getColor()"
  >
    <span class="font-weight-bold">
      {{
      getPercentage()
      }}&nbsp;%
    </span>
  </v-progress-circular>
</template>

<script>
export default {
  name: "the-percentage",
  props: {
    positives: { type: Number },
    total: { type: Number },
    percentage: { type: Number }
  },
  data() {
    return {};
  },
  methods: {
    getPercentage: function() {
      // Divide by zero of course
      if (this.total === 0) return 0;

      if (this.percentage || this.percentage === 0) return this.percentage;

      return Math.round((this.positives / this.total) * 100);
    },

    getColor: function() {
      let percentage = this.getPercentage();

      if (percentage === 0) {
        return "green";
      }

      if (percentage > 0 && percentage <= 50) {
        return "yellow";
      }

      if (percentage > 50 && percentage < 70) {
        return "orange";
      }

      return "red";
    }
  }
};
</script>