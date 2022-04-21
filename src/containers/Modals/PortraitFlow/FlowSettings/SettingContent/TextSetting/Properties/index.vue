<template>
  <div :class="['text-properties', { disabled }]">
    <div class="font">
      <font-family
        :disabled="disabled"
        :selected-font="selectedFont"
        @change="onChange"
      ></font-family>
      <font-size
        :disabled="disabled"
        :nudge-width="80"
        :selected-size="selectedSize"
        @change="onChange"
      ></font-size>
    </div>
    <div class="effect">
      <color-picker
        :disabled="disabled"
        label="Font Color"
        :color="colorVal"
        :show-eye-dropper="false"
        @change="onChangeColor"
      ></color-picker>
      <presentation
        :disabled="disabled"
        :selected-styles="selectedStyles"
        @change="onChange"
      ></presentation>
      <text-case
        :disabled="disabled"
        :selected-case="selectedCase"
        @change="onChange"
      ></text-case>
      <alignment
        :disabled="disabled"
        :show-justify="false"
        :selected-alignment="selectedAlignment"
        @change="onChange"
      ></alignment>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
