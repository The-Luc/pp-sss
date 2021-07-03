<template>
  <div ref="sizeWrapper" class="size-wrapper">
    <slot></slot>
    <div
      v-show="eyeDropper.isOpen"
      class="eye-dropper-overlay"
      :style="{
        cursor: `url(${eyeDropperIcon}) 12 12, auto`
      }"
      @click="onEyeDropperOverlayClick"
    />
    <EyeDropper
      v-if="eyeDropper.isOpen"
      :color="color"
      @colorChange="onChangeColor"
      @keyPress="onKeyPress"
    />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" scoped src="./style.scss"></style>
