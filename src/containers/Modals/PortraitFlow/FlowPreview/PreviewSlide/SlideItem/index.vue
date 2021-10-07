<template>
  <div
    class="slide-item"
    :class="{ 'use-margin': isUseMargin, digital: isDigital }"
  >
    <PreviewThumbnail
      :flow-settings="flowSettings"
      :portraits="portraits"
      :layout="layout"
      :page-number="pageNumber"
      :background-url="backgroundUrl"
      :is-digital="isDigital"
      :screen-number="screenNumber"
    />

    <div class="page-info">
      <div class="right">{{ rightText }}</div>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
