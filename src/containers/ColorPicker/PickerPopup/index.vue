<template>
  <div ref="colorPicker" class="color-picker-container" :style="containerStyle">
    <ColorPicker
      v-click-outside="onClosePicker"
      :value="currentColor"
      :preset-colors="presets"
      @input="updateColor"
      @addPreset="addPreset"
    />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" scoped src="./style.scss" />
