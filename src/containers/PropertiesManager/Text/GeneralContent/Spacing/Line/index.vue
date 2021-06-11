<template>
  <div class="mr-3">
    <span class="properties-title">Line Spacing:</span>
    <PpCombobox
      :items="items"
      :prepended-icon="prependedIcon"
      :appended-icon="appendedIcon"
      :selected-val="selectedLineSpacing"
      @change="onChange"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
