<template>
  <div class="poster-frame-container">
    <span class="properties-title">Poster Frame:</span>
    <div class="control-group">
      <RangeSlider
        v-if="isSliderDisplayed"
        start-line-color="#58595b"
        is-hide-end-thumb
        disabled
        @change="onSliderChange"
      />
      <div v-if="isSliderDisplayed">00:00.000</div>
      <div v-else class="thumbnail">
        <span class="remove-icon" @click="onRemoveThumbnail">&times;</span>
        <img :src="thumbnailUrl" alt="Poster frame thumbnail" />
      </div>
      <v-btn outlined @click="onClickSelectImage">Select Image</v-btn>
    </div>

    <MediaModal
      type="posterFrame"
      :is-open-modal="isOpenModal"
      @select="handleSelectedImage"
      @cancel="onCloseModal"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
