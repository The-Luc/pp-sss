<template>
  <div
    class="preview-thumbnail"
    :style="{ backgroundImage: backgroundUrl && `url(${backgroundUrl})` }"
  >
    <div class="thumb-wrapper">
      <div class="names"></div>

      <div class="portraits">
        <div
          v-for="(dataRow, rowIndex) in portraitData"
          :key="rowIndex"
          class="portrait-row"
        >
          <div
            v-for="(portrait, colIndex) in dataRow"
            :key="colIndex"
            class="portrait"
          >
            <img :src="portrait.imageUrl" :alt="portrait.firstName" />

            <div class="name">{{ portrait.firstName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
