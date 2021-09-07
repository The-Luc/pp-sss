<template>
  <div class="preview-wrapper">
    <PreviewThumbnail
      :portraits="portraits"
      :layout="layout"
      :background-url="backgroundUrl"
      :flow-settings="flowSettings"
    />

    <div class="pages">
      <div
        class="text clickable"
        :disabled="isDisableMoveBack"
        @click="onMoveBack"
      >
        Last Page
      </div>

      <div class="text currentPage">Page {{ pageNo }}</div>

      <div
        class="text clickable"
        :disabled="isDisableMoveNext"
        @click="onMoveNext"
      >
        Next Page
      </div>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
