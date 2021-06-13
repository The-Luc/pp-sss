<template>
  <div class="pp-shadow-container">
    <label class="properties-title">Shadow:</label>
    <Select
      :items="options"
      :selected-val="selectedOption"
      @change="onChangeDropShadow"
    />
    <div v-if="dropShadow" class="shadow-setting-container">
      <Blur :value="currentShadow.shadowBlur" @change="onChangeBlur" />
      <Offset :value="currentShadow.shadowOffset" @change="onChangeOffset" />
      <Opacity :value="currentShadow.shadowOpacity" @change="onChangeOpacity" />
      <div class="group-setting-container">
        <Angle :value="currentShadow.shadowAngle" @change="onChangeAngle" />
        <ShadowColor :color="currentShadow.shadowColor" @change="onChangeColor" />
      </div>
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
