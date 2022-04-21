<template>
  <div class="control-container">
    <div class="control-title">{{ title }}</div>
    <div class="control-slider">
      <Slider
        :value="value"
        :track-fill-color="trackFillColor"
        :is-input-hidden="true"
        :min="min"
        :max="max"
        @change="onChange"
      />
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
