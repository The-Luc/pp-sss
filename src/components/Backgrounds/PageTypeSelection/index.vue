<template>
  <div class="pp-background-select-page-type">
    <span class="pp-background-select-page-type-title">Background Type:</span>
    <PpSelect
      :items="items"
      :disabled="disabled"
      :selected-val="selectedVal"
      @change="onChange"
    />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
