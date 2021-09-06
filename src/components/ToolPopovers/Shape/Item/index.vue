<template>
  <div
    v-if="!isEmpty"
    class="shape-item"
    :class="{ 'shape-item-active': isSelected }"
    @click="onClick"
  >
    <div class="border-inside"></div>

    <div class="shape-preview-img">
      <img :src="item.thumbnail" alt="shape-preview" />
    </div>
  </div>

  <div v-else class="shape-item" />
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
