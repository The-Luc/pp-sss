<template>
  <div class="pp-selector-container">
    <PpSelect
      id="clip-art-type"
      :items="items"
      :selected-val="selectedVal"
      container="#clip-art-type"
      @change="onChange"
    >
    </PpSelect>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
