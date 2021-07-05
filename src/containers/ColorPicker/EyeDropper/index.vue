<template>
  <div
    v-click-outside="onClickOutside"
    class="eye-dropper-container"
    :style="{
      top: `${canvasRect.top}px`,
      left: `${canvasRect.left}px`,
      width: `${canvasRect.width}px`,
      height: `${canvasRect.height}px`,
      cursor: `url(${eyeDropperIcon}) 12 12, auto`
    }"
    @click="onClick"
  >
    <PpEyeDropper
      :color="color"
      @colorChange="onChangeColor"
      @keyPress="onKeyPress"
    />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
