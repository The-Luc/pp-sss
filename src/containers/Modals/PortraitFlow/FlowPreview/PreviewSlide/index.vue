<template>
  <div class="slide-container" :class="{ digital: isDigital }">
    <transition name="slide-preview">
      <div :key="currentIndex" class="preview-container">
        <div
          v-for="(row, pageIndex) in currentPage"
          :key="`row-${pageIndex}`"
          class="slide-content"
          :class="{ 'not-full': !hasFullItem(row.length) }"
        >
          <slide-item
            v-for="(previewData, itemIndex) in row"
            :key="`item-${itemIndex}`"
            :portraits="previewData.item.portraits"
            :layout="previewData.item.layout"
            :background="previewData.item.background"
            :is-full-background="previewData.item.isFullBackground"
            :flow-number="previewData.index + 1"
            :page-number="previewData.item.pageNo"
            :screen-number="previewData.item.screenNo"
            :is-use-margin="!hasFullItem(row.length)"
            :flow-settings="flowSettings"
            :is-digital="isDigital"
          ></slide-item>
        </div>
      </div>
    </transition>

    <the-navigator
      :pages="pages"
      :current-page-index="currentIndex"
      :is-posible-to-back="isPosibleToBack"
      :is-posible-to-next="isPosibleToNext"
      :is-digital="isDigital"
      @move-next="onNext"
      @move-back="onBack"
      @page-selected="onPageChange"
    ></the-navigator>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
