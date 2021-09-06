<template>
  <div class="font-size-container">
    <span class="properties-title">Font Size:</span>
    <PpCombobox
      :key="componentKey"
      :disabled="disabled"
      :items="fontSize"
      :nudge-width="nudgeWidth"
      :prepended-icon="prependedIcon"
      :appended-icon="appendedIcon"
      :selected-val="selectedSize"
      @change="onChange"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
