<template>
  <div class="border-style-container">
    <label class="properties-title">Style:</label>
    <Select
      :items="options"
      is-img-opts
      :selected-val="selectedBorderStyle"
      @change="onChange"
    />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
