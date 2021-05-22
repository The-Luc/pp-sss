<template>
  <span
    class="block"
    :style="[
      !!color && {
        backgroundColor: color
      }
    ]"
    v-bind="dataAttrs"
  >
    {{ text }}

    <slot></slot>
  </span>
</template>

<script src="./script.js"></script>

<style lang="scss" scoped src="./style.scss"></style>
