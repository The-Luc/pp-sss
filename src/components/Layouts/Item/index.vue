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
      <div v-if="isDigital" class="layout-opts">
        <v-icon class="layout-opts__play-icon">play_circle_outline</v-icon>
        <span class="layout-opts__preview">Preview</span>
        <v-icon
          class="layout-opts__heart-icon"
          :class="favoriteData.cssClass"
          @click="onSaveToFavorites"
        >
          {{ favoriteData.iconName }}
        </v-icon>
      </div>
      <v-icon
        v-else-if="!isFavoritesDisabled"
        :class="favoriteData.cssClass"
        @click="onSaveToFavorites"
      >
        {{ favoriteData.iconName }}
      </v-icon>
    </div>
  </div>
  <div v-else class="layout-item" />
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
