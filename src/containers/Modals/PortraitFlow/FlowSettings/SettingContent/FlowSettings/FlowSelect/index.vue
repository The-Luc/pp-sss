<template>
  <div
    class="flow-selector-container"
    :class="{ 'disabled-component': disabled }"
  >
    <div class="flow-selector-title">
      {{ title }}
    </div>
    <pp-select
      :disabled="disabled"
      :items="items"
      :selected-val="selectedVal"
      @change="onChange"
    ></pp-select>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
