<template>
  <div
    class="thumbnail-view-content"
    :class="contentCssClass"
    :style="{ backgroundImage: thumbnailUrl && `url(${thumbnailUrl})` }"
  >
    <div class="border-inside"></div>

    <div v-if="isEditIconDisplayed" class="thumbnail-edit">
      <router-link tag="div" class="icon-wrapper" :to="toLink">
        <v-icon class="icon-edit">edit</v-icon>
      </router-link>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
