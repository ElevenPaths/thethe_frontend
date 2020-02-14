<template>
  <v-chip :color="which_color()" class="caption">{{ what_to_print() }}</v-chip>
</template>

<script>
export default {
  name: "chip-time-from-now",
  props: ["timestamp"],
  computed: {
    timestamp_diff_from_now: function() {
      let ts = this.timestamp;

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

      if (diff.days == 0 && diff.hours == 0) {
        return `just ${diff.minutes} mins ago`;
      }

      if (diff.days == 0 && diff.hours > 0) {
        return `${diff.hours}h ${diff.minutes}m ago`;
      }

      if (diff.days > 0 && diff.days < 10) {
        return `${diff.days} days and ${diff.hours}h ago`;
      }

      if (diff.days > 0) {
        return `${diff.days} days ago`;
      }
    },
    which_color: function() {
      let days = this.timestamp_diff_from_now.days;
      if (days == 0) {
        return "green";
      }

      if (days > 0 && days < 2) {
        return "green darken-1";
      }

      if (days >= 2 && days < 3) {
        return "green lighten-2";
      }

      if (days >= 3 && days < 7) {
        return "light-blue accent-2";
      }

      if (days >= 7 && days < 15) {
        return "orange lighten-3";
      }

      if (days >= 15) {
        return "red darken-1";
      }
    }
  }
};
</script>
