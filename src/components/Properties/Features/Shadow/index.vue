<template>
  <div class="pp-shadow-container">
    <label class="properties-title">Shadow:</label>
    <Select
      :items="options"
      :selected-val="selectedOption"
      @change="onChangeDropShadow"
    />
    <div v-if="dropShadow" class="shadow-setting-container">
      <Blur :value="currentShadow.shadowBlur" @change="onChange" />
      <Offset :value="currentShadow.shadowOffset" @change="onChange" />
      <Opacity :value="currentShadow.shadowOpacity" @change="onChangeOpacity" />
      <div class="group-setting-container">
        <Angle :value="currentShadow.shadowAngle" @change="onChange" />
        <ShadowColor :color="currentShadow.shadowColor" @change="onChange" />
      </div>
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
