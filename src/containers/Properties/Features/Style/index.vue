<template>
  <div class="border-style-container">
    <label class="properties-title">Style:</label>
    <pp-select
      :items="options"
      is-img-opts
      :selected-val="selectedBorderStyle"
      @change="onChange"
    ></pp-select>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
