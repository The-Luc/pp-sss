<template>
  <div class="page-size-wrapper">
    <div class="ruler-wrapper">
      <div class="ruler-x-placeholder">
        <slot name="ruler-x"></slot>
      </div>
    </div>
    <div class="ruler-y-placeholder">
      <slot name="ruler-y"></slot>
    </div>
    <div ref="pageSizeWp" class="inner-ruler-wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" scoped src="./style.scss"></style>
