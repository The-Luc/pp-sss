<template>
  <div class="pp-shadow-container">
    <label class="properties-title">Shadow:</label>
    <Select
      :items="options"
      :selected-val="selectedShadow"
      @change="onChange"
    />
    <div v-if="isShowShadow" class="shadow-setting-container">
      <Blur :value="blurValue" @change="onChangeBlur" />
      <Offset :value="offsetValue" @change="onChangeOffset" />
      <Opacity :value="opacityValue" @change="onChangeOpacity" />
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
