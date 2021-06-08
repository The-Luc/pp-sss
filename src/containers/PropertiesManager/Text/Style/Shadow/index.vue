<template>
  <div class="pp-shadow-container">
    <label class="properties-title">Shadow:</label>
    <Select
      :items="options"
      :selected-val="selectedShadow"
      @change="onChange"
    />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
