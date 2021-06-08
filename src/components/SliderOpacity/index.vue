<template>
  <div class="slider-container">
    <input
      v-model="value"
      type="range"
      class="slider"
      min="0"
      max="100"
      @change="change()"
    />
    <div class="input-container">
      <input
        v-model="value"
        type="number"
        min="0"
        max="100"
        @change="change()"
      />
      <div class="input-label">{{ label }}</div>
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
