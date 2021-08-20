<template>
  <div class="trim-container">
    <span class="properties-title">Trim:</span>
    <div class="control-group">
      <RangeSlider @change="onSliderChange" />
      <div class="label-text">
        Start Time: <span class="label-time">00:00.000</span>
      </div>
      <div class="label-text">
        Start End: <span class="label-time">00:18.833</span>
      </div>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
