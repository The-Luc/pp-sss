<template>
  <div
    v-if="!isEmpty"
    class="shape-item"
    :class="{ 'shape-item-active': selectedVal.id === item.id }"
    @click="onClick"
  >
    <div class="border-inside"></div>

    <div class="shape-preview-img">
      <img :src="item.property.thumbnail" alt="shape-preview" />
    </div>

    <div class="shape-preview-img-footer">
      <span class="shape-name">{{ item.property.name }}</span>
    </div>
  </div>

  <div v-else class="shape-item" />
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
