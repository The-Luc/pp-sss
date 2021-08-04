<template>
  <div class="album-container">
    <div class="album-title">
      <div class="album-name">{{ name }}</div>
      <div class="album-date">{{ displayDate }}</div>
    </div>
    <div class="image-container">
      <div
        v-for="asset in assets"
        :key="asset.id"
        :class="['image-item', { 'image-item-active': isActive(asset.id) }]"
        @click="onSelected(asset)"
      >
        <v-icon class="icon-check">done</v-icon>
        <img :src="asset.thumbUrl" alt="" />
      </div>
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
