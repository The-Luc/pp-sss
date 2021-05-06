<template>
  <div class="col-3 thumbnail-view-item">
    <div class="thumbnail-view-container">
      <div class="thumbnail-view-header">
        <div>
          <div
            class="header-color"
            :style="{ 'background-color': `${section.color}` }"
          ></div>
          <div class="header-name">{{ section.name }}</div>
        </div>
        <div class="header-more">
          <v-icon class="icon-more">more_horiz</v-icon>
        </div>
      </div>
      <div :class="[{ 'half-left': !isTypeFull }, 'thumbnail-view-thumbnail']">
        <img src="@/assets/image/chart.png" />
        <div class="thumbnail-edit">
          <v-icon class="icon-edit">edit</v-icon>
        </div>
      </div>
      <div class="thumbnail-view-number-page">
        <div class="number-page-left">1</div>
        <div v-if="isTypeFull" :class="['number-page-link']">
          <v-icon class="icon-link">link</v-icon>
        </div>
        <div class="number-page-right">2</div>
      </div>
    </div>
  </div>
</template>
<script src="./script.js" />
<style lang="scss" scoped src="./style.scss" />
