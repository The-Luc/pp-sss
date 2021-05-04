<style lang="scss" scoped>
@import "./style.scss";
</style>

<template>
  <div>
    <router-link
      v-if="type === 'link'"
      :to="linkTo"
      class="pp-btn item-center pointer"
      :class="{
        active: isActive,
        disabled: isDisabled
      }"
      @click="onClick"
      :style="ovStyle"
    >
      <slot />
    </router-link>
    <div
      v-if="type === 'btn'"
      class="pp-btn item-center pointer"
      :class="{
        active: isActive,
        disabled: isDisabled
      }"
      @click="onClick"
      :style="ovStyle"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "pp-btn",
  props: {
    type: String,
    linkTo: String,
    isActive: Boolean,
    isDisabled: Boolean,
    addClass: Array,
    ovStyle: Object,
    action: Function
  },
  methods: {
    onClick() {
      this.$emit("click");
    }
  }
};
</script>
