<template>
  <span
    class="block"
    :class="isSpaceByBorder && 'border'"
    :style="[
      !!color && {
        backgroundColor: color
      },
      !!specialWidth && { width: `${specialWidth}%` }
    ]"
    v-bind="dataAttrs"
  >
    {{ text }}

    <slot></slot>
  </span>
</template>

<script src="./script.js"></script>

<style lang="scss" scoped src="./style.scss"></style>
