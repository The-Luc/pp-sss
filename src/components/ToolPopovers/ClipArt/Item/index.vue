<template>
  <div
    v-if="!isEmpty"
    class="clip-art-item"
    :class="{ 'clip-art-item-active': isActive }"
    @click="onClick"
  >
    <div class="border-inside"></div>
    <div class="clip-art-preview-img">
      <img :src="clipArt.thumbnail" alt="clip-art-preview" />
    </div>
    <div class="clip-art-preview-img-footer">
      <v-icon>
        favorite_border
      </v-icon>
    </div>
  </div>
  <div v-else class="clip-art-item disabled" />
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
