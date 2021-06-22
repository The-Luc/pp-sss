<template>
  <div class="horizontal-ruler" :style="containerStyle">
    <XUnit
      v-for="(unit, index) in unitArray"
      :key="index"
      :number="unit.number"
      :width="config.width"
      :left-border="unit.leftBorder"
      :right-border="unit.rightBorder"
      :hide-number="unit.hideNumber"
      :is-end="unit.isEnd"
    />
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
