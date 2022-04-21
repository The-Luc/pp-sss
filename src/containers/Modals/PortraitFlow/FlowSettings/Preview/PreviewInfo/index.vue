<template>
  <div class="preview-info">
    <div class="text">Based on current settings:</div>

    <div class="description">
      {{ totalPortrait }} portraits will require {{ totalPages }}
      {{ `${containerName.toLowerCase()}(s)` }}
    </div>

    <div class="preview">
      <v-btn class="btn" @click="onShowPreview">Preview</v-btn>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
