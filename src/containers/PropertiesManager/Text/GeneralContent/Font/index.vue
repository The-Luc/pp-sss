<template>
  <div class="font-container">
    <div class="col-7">
      <FontFamily :selected-font="selectedFont" @change="onChangFontFamily" />
    </div>
    <div class="col-4">
      <FontSize :selected-size="selectedSize" @change="onChangFontSize" />
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" scoped src="./style.scss" />
