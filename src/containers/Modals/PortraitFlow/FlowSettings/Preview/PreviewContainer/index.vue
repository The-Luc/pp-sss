<template>
  <div class="preview-wrapper" :class="{ digital: isDigital }">
    <PreviewThumbnail
      :portraits="portraits"
      :layout="layout"
      :page-number="pageNo"
      :background-url="backgroundUrl"
      :flow-settings="flowSettings"
      :is-digital="isDigital"
    />

    <div class="pages">
      <div
        class="text clickable"
        :disabled="isDisableMoveBack"
        @click="onMoveBack"
      >
        Last {{ containerName }}
      </div>

      <div class="text currentPage">{{ containerName }} {{ pageNo }}</div>

      <div
        class="text clickable"
        :disabled="isDisableMoveNext"
        @click="onMoveNext"
      >
        Next {{ containerName }}
      </div>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
