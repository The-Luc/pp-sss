<template>
  <div class="trim-container">
    <span class="properties-title">Trim:</span>
    <div class="control-group">
      <RangeSlider @change="onSliderChange" />
      <div class="label-start">Start Time: 00:00.000</div>
      <div class="label-end">Start End: 00:18.833</div>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
