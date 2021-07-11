<template>
  <div class="pp-selector-container">
    <span class="pp-selector-container-title">Background Type:</span>
    <PpSelect
      id="background-page-type"
      :items="items"
      :disabled="disabled"
      :selected-val="selectedVal"
      container="#background-page-type"
      @change="onChange"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
