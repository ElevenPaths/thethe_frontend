<template>
  <a :href="url" rel="noreferer noopener nofollow" target="_blank">
    {{ text }}
    <slot></slot>
  </a>
</template>

<script>
export default {
  props: ["url", "text"],
  name: "SecLink"
};
</script>
