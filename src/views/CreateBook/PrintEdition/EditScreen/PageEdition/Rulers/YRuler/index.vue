<template>
  <div class="vertical-ruler" :style="containerStyle">
    <YUnit
      v-for="(unit, index) in unitArray"
      :key="index"
      :number="unit.number"
      :height="config.height"
      :top-border="unit.topBorder"
      :bottom-border="unit.bottomBorder"
    />
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
