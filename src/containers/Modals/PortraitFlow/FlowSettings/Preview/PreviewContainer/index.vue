<template>
  <div class="preview-wrapper" :class="{ digital: isDigital }">
    <transition name="thumb-preview">
      <preview-thumbnail
        :key="pageNo"
        :portraits="portraits"
        :layout="layout"
        :page-number="pageNo"
        :background="background"
        :is-full-background="isFullBackground"
        :flow-settings="flowSettings"
        :is-digital="isDigital"
        :screen-number="screenNumber"
      ></preview-thumbnail>
    </transition>

    <div class="pages" :class="{ disabled: disabled }">
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
