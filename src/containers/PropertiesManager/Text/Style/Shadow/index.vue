<template>
  <div class="pp-shadow-container">
    <label class="properties-title">Shadow:</label>
    <Select
      :items="options"
      :selected-val="selectedShadow"
      @change="onChange"
    />
    <div v-if="isShowShadow" class="shadow-setting-container">
      <Blur :value="blurValue" @changeBlur="onChangeBlur" />
      <Offset :value="offsetValue" @changeOffset="onChangeOffset" />
      <Opacity :value="opacityValue" @changeOpacity="onChangeOpacity" />
      <div class="group-setting-container">
        <Angle :value="angleValue" @changeAngle="onChangeAngle" />
        <ShadowColor />
      </div>
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
