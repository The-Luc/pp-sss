<template>
  <div class="slide-container">
    <div class="slide-content" :class="{ 'not-full': !hasFullItem }">
      <slide-item
        v-for="(previewData, index) in currentPage"
        :key="index"
        :portraits="previewData.item.portraits"
        :layout="previewData.item.layout"
        :background-url="previewData.item.backgroundUrl"
        :flow-number="previewData.index + 1"
        :page-number="previewData.item.pageNo"
        :is-use-margin="!hasFullItem"
        :flow-settings="flowSettings"
      ></slide-item>
    </div>

    <the-navigator
      :pages="pages"
      :current-page-index="currentIndex"
      :is-posible-to-back="isPosibleToBack"
      :is-posible-to-next="isPosibleToNext"
      @move-next="onNext"
      @move-back="onBack"
      @page-selected="onPageChange"
    ></the-navigator>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
