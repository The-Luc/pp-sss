<template>
  <div class="x-unit" :style="style">
    <div class="sx-unit">&nbsp;</div>
    <div class="sx-unit-separator">&nbsp;</div>
    <div class="sx-unit">&nbsp;</div>
    <div class="sx-unit-separator">&nbsp;</div>
    <div class="sx-unit">&nbsp;</div>
    <div class="sx-unit-separator">&nbsp;</div>
    <div class="sx-unit">&nbsp;</div>
    <div class="sx-unit-separator">&nbsp;</div>
    <div class="sx-unit">&nbsp;</div>
    <div class="sx-unit-separator-mid">&nbsp;</div>
    <div class="sx-unit">&nbsp;</div>
    <div class="sx-unit-separator">&nbsp;</div>
    <div class="sx-unit">&nbsp;</div>
    <div class="sx-unit-separator">&nbsp;</div>
    <div class="sx-unit">&nbsp;</div>
    <div class="sx-unit-separator">&nbsp;</div>
    <div class="sx-unit">&nbsp;</div>
    <div class="sx-unit-separator">&nbsp;</div>
    <div class="sx-unit">&nbsp;</div>
    <div v-if="!hideNumber" class="x-unit-number" :class="{ 'at-end': isEnd }">
      {{ number }}
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
