<template>
  <div
    class="thumbnail-view-content"
    :class="contentCssClass"
    :style="{ backgroundImage: thumbnailUrl && `url(${thumbnailUrl})` }"
    @click="onSelect"
  >
    <div
      v-if="leftThumbnailUrl"
      class="left-thumbnail"
      :style="{ backgroundImage: `url(${leftThumbnailUrl})` }"
    ></div>
    <div
      v-if="rightThumbnailUrl"
      class="right-thumbnail"
      :style="{ backgroundImage: `url(${leftThumbnailUrl})` }"
    ></div>
    <div class="border-inside"></div>

    <router-link
      v-if="isEditIconDisplayed"
      tag="div"
      class="thumbnail-edit"
      :to="toLink"
    >
      <div class="icon-wrapper">
        <v-icon class="icon-edit">edit</v-icon>
      </div>
    </router-link>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
