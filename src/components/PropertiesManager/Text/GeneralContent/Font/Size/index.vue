<template>
  <div class="font-size-container">
    <span class="properties-title">Font Size:</span>
    <PpCombobox
      :items="items"
      :prepended-icon="prependedIcon"
      :appended-icon="appendedIcon"
      @change="onChange"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
