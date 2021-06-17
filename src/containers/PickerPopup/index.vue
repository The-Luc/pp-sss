<template>
  <div
    ref="colorPicker"
    class="color-picker-container"
    :style="{
      top: `${top}px`,
      right: `${right}px`
    }"
  >
    <ColorPicker
      v-click-outside="onClosePicker"
      :value="color"
      :preset-colors="presets"
      @input="updateColor"
      @addPreset="addPreset"
    />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
