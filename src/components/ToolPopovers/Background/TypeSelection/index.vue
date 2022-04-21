<template>
  <div class="pp-selector-container">
    <span class="pp-selector-container-title"></span>
    <PpSelect
      id="background-type"
      :items="items"
      :selected-val="selectedVal"
      container="#background-type"
      @change="onChange"
    >
    </PpSelect>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
