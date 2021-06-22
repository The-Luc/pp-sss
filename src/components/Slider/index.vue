<template>
  <div class="pp-slider-container">
    <div class="control-input">
      <v-slider
        class="pp-slider"
        :max="max"
        :min="min"
        :value="value"
        :track-color="trackColor"
        :track-fill-color="trackFillColor"
        :thumb-color="thumbColor"
        height="6"
        hide-details
        width="235"
        loader-height="6"
        @input="onChangeSlider"
      >
      </v-slider>
      <PpInput
        :suffix="suffix"
        :value="value"
        :max="max"
        :min="min"
        type="text"
        @change="onChangeInput"
      />
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
