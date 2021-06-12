<template>
  <div :class="['color-picker-container', customClass]">
    <ColorPicker
      :value="color"
      :preset-colors="presets"
      @input="updateColor"
      @addPreset="addPreset"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
