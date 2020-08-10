<template>
  <v-chip small label class="caption font-weight-bold">
    {{ what_to_print() }}
    <slot></slot>
  </v-chip>
</template>

<script>
export default {
  name: "chip-time-from-now",
  props: ["timestamp"],
  computed: {
    timestamp_diff_from_now: function() {
      let ts = this.timestamp;

      if (!ts) return null;

      if (ts < 1500000000000) ts *= 1000;

      let diff = Date.now() - ts;

      let days = Math.floor(diff / 1000 / 60 / 60 / 24);
      diff -= days * 1000 * 60 * 60 * 24;

      let hours = Math.floor(diff / 1000 / 60 / 60);
      diff -= hours * 1000 * 60 * 60;

      let minutes = Math.floor(diff / 1000 / 60 / 60);
      diff -= minutes * 1000 * 60;

      return { days: days, hours: hours, minutes: minutes };
    }
  },
  methods: {
    what_to_print: function() {
      let diff = this.timestamp_diff_from_now;

      if (!diff) {
        return `not launched`;
      }

      if (diff.days == 0 && diff.hours == 0) {
        return `${diff.minutes} mins`;
      }

      if (diff.days == 0 && diff.hours > 0) {
        return `${diff.hours} ${diff.hours === 1 ? "hour" : "hours"}`;
      }

      if (diff.days > 0) {
        return `${diff.days} days`;
      }
    }
  }
};
</script>
