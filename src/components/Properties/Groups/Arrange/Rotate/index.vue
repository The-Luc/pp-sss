<template>
  <div class="d-flex flex-column rotate-container">
    <span class="properties-title">Rotate:</span>
    <div class="d-flex">
      <div class="item-container">
        <PpInput
          suffix="°"
          :disabled="disabled"
          :value="value"
          :max="360"
          :min="-360"
          type="text"
          @change="onChange"
        />
        <div class="item-title">Angle</div>
      </div>
    </div>
  </div>
</template>
<script src="./script.js" />

<style lang="scss" src="./style.scss" />
