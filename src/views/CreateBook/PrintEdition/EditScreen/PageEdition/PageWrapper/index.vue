<template>
  <div class="page-wrapper">
    <div class="ruler-wrapper">
      <div class="ruler-x-placeholder">
        <slot name="ruler-x"></slot>
      </div>
    </div>
    <div class="ruler-y-placeholder">
      <slot name="ruler-y"></slot>
    </div>
    <div class="inner-ruler-wrapper">
      <slot></slot>
      <AddBoxInstruction v-if="visible" :element="element" :x="x" :y="y" />
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" scoped src="./style.scss"></style>
