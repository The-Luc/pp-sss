<template>
  <div class="d-flex flex-column rotate-container">
    <span class="properties-title">Rotate:</span>
    <div class="d-flex">
      <div class="item-container">
        <PpNumber
          suffix="°"
          :value="value"
          :max="max"
          :min="min"
          @change="onChange"
        />
        <div class="item-title">Angle</div>
      </div>
    </div>
  </div>
</template>
<script src="./script.js" />

<style lang="scss" src="./style.scss" />
