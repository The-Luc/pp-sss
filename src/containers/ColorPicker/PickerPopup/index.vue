<template>
  <div
    ref="colorPicker"
    v-click-outside="onClosePicker"
    class="color-picker-container"
    :style="[containerStyle, { '--h': `${height}px` }]"
  >
    <ColorPicker
      :value="currentColor"
      :preset-colors="presets"
      @input="updateColor"
      @addPreset="addPreset"
    />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
