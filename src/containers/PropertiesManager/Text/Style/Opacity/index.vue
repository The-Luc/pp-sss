<template>
  <div class="opacity-container">
    <label class="text-500 text-size-xsm">Opacity:</label>
    <Slider :value="value" @change="onChange" />
  </div>
</template>
<script src="./script.js" />

<style lang="scss" src="./style.scss" />
