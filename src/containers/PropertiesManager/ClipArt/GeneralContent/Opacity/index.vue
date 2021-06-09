<template>
  <div class="opacity-container">
    <span class="properties-title">Opacity: </span>
    <SliderOpacity :value="value" @change="onChange" />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
