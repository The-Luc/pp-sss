<template>
  <div class="slide-item" :class="{ 'use-margin': isUseMargin }">
    <PreviewThumbnail
      :portraits="portraits"
      :layout="layout"
      :background-url="backgroundUrl"
    />

    <div class="page-info">
      <div class="flow-no">Portrait flow {{ flowNumber }}</div>
      <div class="page-no">Page {{ pageNumber }}</div>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
