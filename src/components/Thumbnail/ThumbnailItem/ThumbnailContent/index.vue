<template>
  <div
    class="thumbnail-view-content"
    :class="contentCssClass"
    :style="{ backgroundImage: thumbnailUrl && `url(${thumbnailUrl})` }"
    @click="onSelect"
  >
    <div
      v-if="!thumbnailUrl && thumbnailLeftUrl"
      class="left-thumbnail"
      :style="{ backgroundImage: `url(${thumbnailLeftUrl})` }"
    ></div>
    <div
      v-if="!thumbnailUrl && thumbnailRightUrl"
      class="right-thumbnail"
      :style="{ backgroundImage: `url(${thumbnailRightUrl})` }"
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
