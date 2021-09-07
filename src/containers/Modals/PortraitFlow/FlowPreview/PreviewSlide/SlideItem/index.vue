<template>
  <div class="slide-item" :class="{ 'use-margin': isUseMargin }">
    <PreviewThumbnail
      :flow-settings="flowSettings"
      :portraits="portraits"
      :layout="layout"
      :page-number="pageNumber"
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
