<template>
  <div
    v-if="!isEmpty"
    class="layout-item"
    :class="{ 'layout-item-active': selectedLayoutId === layout.id }"
    @click="onClick"
  >
    <div class="border-inside"></div>
    <div class="layout-preview-img">
      <img :src="layout.previewImageUrl" alt="layout-preview" />
    </div>
    <div class="layout-preview-img-footer">
      <span class="layout-name">{{ layout.name }}</span>
      <v-icon>
        favorite_border
      </v-icon>
    </div>
  </div>
  <div v-else class="layout-item" />
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
