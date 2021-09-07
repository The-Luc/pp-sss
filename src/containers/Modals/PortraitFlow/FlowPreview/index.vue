<template>
  <div class="preview-wrapper">
    <div class="summary">
      {{ flowSettings.totalPortraitsCount }} portraits =
      {{ requiredPages.length }} pages
    </div>
    <PreviewSlide :flow-settings="flowSettings" :items="previewItems" />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
