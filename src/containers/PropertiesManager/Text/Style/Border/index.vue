<template>
  <div class="border-container">
    <label class="properties-title">Border:</label>
    <Select
      :items="options"
      :selected-val="selectedBorder"
      @change="onChange"
    />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
