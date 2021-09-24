<template>
  <div class="preview-wrapper" :class="{ digital: isDigital }">
    <div class="summary">
      {{ flowSettings.totalPortraitsCount }} portraits =
      {{ `${requiredPages.length} ${isDigital ? 'frame' : 'page'}(s)` }}
    </div>

    <PreviewSlide
      :flow-settings="flowSettings"
      :items="previewItems"
      :is-digital="isDigital"
    />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
