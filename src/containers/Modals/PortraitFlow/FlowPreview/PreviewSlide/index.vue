<template>
  <div class="slide-container">
    <div class="slide-content" :class="contentCustomClass">
      <div
        v-for="(previewData, index) in currentPage"
        :key="index"
        class="slide-item"
      >
        <PreviewThumbnail
          :portraits="previewData.item.portraits"
          :layout="previewData.item.layout"
          :background-url="previewData.item.backgroundUrl"
        />

        <div class="page-info">
          <div class="flow-no">Portrait flow {{ previewData.index + 1 }}</div>
          <div class="page-no">Page {{ previewData.item.pageNo }}</div>
        </div>
      </div>
    </div>

    <div class="slide-navigator">
      <div class="icon" :class="{ disabled: !isPosibleToBack }" @click="onBack">
        <i class="material-icons-outlined">
          circle
        </i>
        <i class="material-icons-outlined icon-inner icon-inner-back">
          chevron_left
        </i>
      </div>

      <div class="paggings">
        <i
          v-for="(page, index) in pages"
          :key="index"
          class="material-icons pagging"
          :class="{ active: index === currentIndex }"
          @click="onPageChange(index)"
        >
          circle
        </i>
      </div>

      <div class="icon" :class="{ disabled: !isPosibleToNext }" @click="onNext">
        <i class="material-icons-outlined icon-inner icon-inner-next">
          chevron_right
        </i>
        <i class="material-icons-outlined" @click="onNext">
          circle
        </i>
      </div>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
