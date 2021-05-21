<template>
  <div class="font-size-container">
    <span class="properties-title">Font Size:</span>
    <PpSelect
      :items="items"
      :prepended-icon="prependedIcon"
      :appended-icon="appendedIcon"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss">
