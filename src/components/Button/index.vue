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
      :style="ovStyle"
      @click="onClick"
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
      :style="ovStyle"
      @click="onClick"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "PpBtn",
  props: {
    type: {
      type: String,
      default: "btn"
    },
    linkTo: {
      type: String,
      default: ""
    },
    isActive: Boolean,
    isDisabled: Boolean,
    addClass: {
      type: Array,
      default: () => []
    },
    ovStyle: {
      type: Object,
      default: () => ({})
    },
    action: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    onClick() {
      this.$emit("click");
    }
  }
};
</script>

<style lang="scss" scoped src="./style.scss" />
