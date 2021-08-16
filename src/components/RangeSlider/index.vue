<template>
  <div class="pp-range-slider-container">
    <div class="control-input">
      <v-range-slider
        ref="rangeSlider"
        class="pp-range-slider"
        :max="max"
        :min="min"
        :value="value"
        :track-color="trackColor"
        :track-fill-color="trackFillColor"
        :thumb-color="thumbColor"
        height="3"
        loader-height="3"
        hide-details
        width="100%"
        :disabled="disabled"
        @change="onSliderChange"
      >
      </v-range-slider>
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
