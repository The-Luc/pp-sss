<template>
  <div class="pp-layouts-select-theme">
    <span class="pp-layouts-select-theme-title">Theme:</span>
    <PpSelect :items="items" @change="onChangeTheme" />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
