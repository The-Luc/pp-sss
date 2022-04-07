<template>
  <div id="preview-item__container">
    <div
      v-for="(image, idx) in images"
      :key="image.id"
      :class="[
        'preview-container',
        { digital: isDigital, active: image.id === idOfActiveImage }
      ]"
    >
      <button @click="() => onChangeActiveImage(image.id)">
        <img :src="image.previewImageUrl" alt="preview image" />
      </button>
      <div v-if="isSingleLayout" class="preview-image__title single-layout">
        Single Page
      </div>
      <div v-else-if="!isDigital" class="preview-image__title">
        <p>Left Page</p>
        <p>Right Page</p>
      </div>
      <div v-else class="preview-image__title">Frame {{ idx + 1 }}</div>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
