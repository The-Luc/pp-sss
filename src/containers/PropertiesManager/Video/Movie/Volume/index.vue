<template>
  <div class="volume-container">
    <span class="properties-title">Volume:</span>
    <div class="control-group">
      <v-icon>mdi-volume-low</v-icon>
      <Slider :value="volume" :is-show-input="false" @change="onChange" />
      <v-icon>mdi-volume-high</v-icon>
    </div>
  </div>
</template>
<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
