<template>
  <div class="preview-thumbnail">
    <div
      class="thumbnail"
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

    <div class="pages">
      <div
        class="text clickable"
        :disabled="isDisableMoveBack"
        @click="onMoveBack"
      >
        Last Page
      </div>

      <div class="text currentPage">Page {{ pageNo }}</div>

      <div
        class="text clickable"
        :disabled="isDisableMoveNext"
        @click="onMoveNext"
      >
        Next Page
      </div>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
