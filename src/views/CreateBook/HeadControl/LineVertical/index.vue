<template>
  <hr class="line" :style="{ height: `${height}px` }" />
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      default: '25'
    }
  }
};
</script>

<style lang="scss" scoped src="./style.scss" />
