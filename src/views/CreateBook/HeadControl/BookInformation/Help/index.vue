<template>
  <div class="btn-help item-center pointer">
    <img class="help" :src="ICON_LOCAL.HELP" alt="help" width="14" />
    <p class="text-500 text-size-xxs white--text text-center mb-0">
      Help
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
