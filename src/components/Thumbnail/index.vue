<template>
  <div class="body-thumbnail">
    <div :class="[{ 'half-left': !isTypeFull }, 'thumbnail-view-thumbnail']">
      <img src="@/assets/image/chart.png" />
      <div v-if="edit" class="thumbnail-edit">
        <v-icon class="icon-edit">edit</v-icon>
      </div>
    </div>
    <div class="thumbnail-view-number-page">
      <div class="number-page-left">1</div>
      <div v-show="link" v-if="isTypeFull" :class="['number-page-link']">
        <v-icon class="icon-link">link</v-icon>
      </div>
      <div class="number-page-right">2</div>
    </div>
  </div>
</template>
<script src="./script.js" />
<style lang="scss" scoped src="./style.scss" />
