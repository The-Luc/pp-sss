<template>
  <div class="btn-exit pointer">
    <img
      class="arrow-left"
      :src="ICON_LOCAL.ARROW_LEFT"
      alt="arrow_left"
      width="14"
    />
    <p class="text text-center mb-0">
      Exit Yearbook Builder
    </p>
  </div>
</template>

<script>
import ICON_LOCAL from "@/common/constants/icon";

export default {
  created() {
    this.ICON_LOCAL = ICON_LOCAL;
  }
};
</script>

<style lang="scss" scoped src="./style.scss" />
