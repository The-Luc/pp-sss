<template>
  <div class="item">
    <p class="text-300 item-title mb-0">{{ title }}</p>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" src="./style.scss" scoped />
