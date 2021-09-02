<template>
  <div class="text-properties">
    <div class="font">
      <FontFamily :selected-font="selectedFont" @change="onChange" />
      <FontSize
        :nudge-width="80"
        :selected-size="selectedSize"
        @change="onChangFontSize"
      />
    </div>
    <div class="effect">
      <ColorPicker
        label="Font Color"
        :color="colorVal"
        :show-eye-dropper="false"
        @change="onChangeColor"
      />
      <Presentation :selected-styles="selectedStyles" @change="onChange" />
      <TextCase :selected-case="selectedCase" @change="onChange" />
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
