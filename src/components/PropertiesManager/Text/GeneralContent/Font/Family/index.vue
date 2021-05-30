<template>
  <div>
    <span class="properties-title">Font Family:</span>
    <PpSelect
      :selected-val="selectedVal"
      :items="items"
      @change="changeFontFamily($event)"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
