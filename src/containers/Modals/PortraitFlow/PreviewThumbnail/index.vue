<template>
  <div
    class="preview-thumbnail"
    :class="{
      landscape: isDigital,
      half: isFullBackground,
      right: pageNumber % 2 !== 0
    }"
    :style="{ backgroundImage: backgroundUrl && `url(${backgroundUrl})` }"
  >
    <div
      v-show="showPageTitile"
      ref="pageTitle"
      class="page-title"
      :style="pageTitleStyle"
    >
      {{ title }}
    </div>

    <div ref="thumbWrapper" class="thumb-wrapper">
      <name-section
        v-show="!isCenterPosition"
        :portraits="portraitNames"
        :is-first-last-display="isFirstLastDisplay"
        :is-page-right="isPageRight"
        :name-css-style="nameTextStyle"
        :row-css-style="namesHeight"
        :container-css-style="nameContainerStyle"
      ></name-section>

      <portrait-section
        ref="portraitsSection"
        :portraits="portraitItems"
        :is-first-last-display="isFirstLastDisplay"
        :is-center-position="isCenterPosition"
        :name-css-style="nameTextStyle"
        :image-style="imageStyle"
      ></portrait-section>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
