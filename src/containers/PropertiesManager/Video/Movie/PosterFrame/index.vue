<template>
  <div class="poster-frame-container">
    <span class="properties-title">Poster Frame:</span>
    <div class="control-group">
      <RangeSlider
        start-line-color="#58595b"
        is-hide-end-thumb
        @change="onSliderChange"
      />
      <div>00:00.000</div>
      <v-btn outlined @click="onClickSelectImage">Select Image</v-btn>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
