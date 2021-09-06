<template>
  <div :class="['margin', { disabled }]">
    <div class="text-margin">Text Margins:</div>
    <box-margin
      label="Top Margin"
      :disabled="disabled"
      :selected-val="topMargin"
      @change="onChangeTopMargin"
    ></box-margin>
    <box-margin
      label="Left Margin"
      :disabled="disabled"
      :selected-val="leftMargin"
      @change="onChangeLeftMargin"
    ></box-margin>
    <box-margin
      label="Right Margin"
      :disabled="disabled"
      :selected-val="rightMargin"
      @change="onChangeRightMargin"
    ></box-margin>
    <box-margin
      label="Bottom Margin"
      :disabled="disabled"
      :selected-val="bottomMargin"
      @change="onChangeBottomMargin"
    ></box-margin>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
