<template>
  <div class="mapping-preview">
    <div class="mapping-preview__title">
      {{ title }}: <span>{{ layout.name }}</span>
    </div>
    <div class="mapping-preview__image-container">
      <div
        v-for="(image, idx) in previewImages"
        :key="idx"
        :class="[
          'mapping-preview__image-group',
          { 'image-group--digital': isDigital }
        ]"
      >
        <img class="preview_image" :src="image" alt="preview image" />
        <span v-if="isDigital" class="frame-title">Frame {{ idx + 1 }}</span>
      </div>
    </div>
    <button class="mapping-preview__edit" @click="onClickEdit">
      [ Edit Selection ]
    </button>
    <div class="mapping-preivew__footer"></div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
