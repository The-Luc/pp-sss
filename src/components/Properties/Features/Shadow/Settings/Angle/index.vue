<template>
  <div class="angle-container">
    <span class="properties-title">Angle: </span>
    <AnglePicker :angle="value" @change="onChange" />
    <div class="angle-separator">&nbsp;</div>
    <PpNumber
      suffix="°"
      :value="value"
      :max="360"
      :min="0"
      @change="onChange"
    />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
