<template>
  <div
    v-if="!isEmpty"
    class="background-item"
    :class="{ 'background-item-active': selectedVal.id === item.id }"
    @click="onClick"
  >
    <div class="border-inside"></div>

    <div class="background-preview-img">
      <img
        :class="isSinglePage ? 'single-page' : 'full-page'"
        :src="item.thumbnail"
        alt="background-preview"
      />
    </div>

    <div class="background-preview-img-footer">
      <span class="background-name">{{ item.name }}</span>

      <v-icon>
        favorite_border
      </v-icon>
    </div>
  </div>

  <div v-else class="background-item" />
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
