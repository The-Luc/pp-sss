<style lang="scss" scoped>
@import "./style.scss";
</style>

<template>
  <hr class="line" :style="{ height: `${height}px` }" />
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      default: "25"
    }
  }
};
</script>
