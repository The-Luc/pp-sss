<template>
  <div class="angle-container">
    <span class="properties-title">Angle: </span>
    <div class="angle-content"></div>
    <PpNumber
      suffix="°"
      :value="value"
      :max="max"
      :min="min"
      @change="onChangeInput"
    />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
