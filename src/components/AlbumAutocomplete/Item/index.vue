<template>
  <div class="item-dropdown">
    <div class="img-container">
      <div
        v-for="i in totalThumbnailDisplay"
        :key="i"
        :style="{ backgroundImage: `url('${album.assets[i - 1].thumbUrl}')` }"
      ></div>
    </div>
    <div class="album-info">
      <!-- eslint-disable vue/no-v-html -->
      <div class="name" v-html="`${parent.genFilteredText(album.name)}`" />
      <!--eslint-enable-->
      <div class="asset">{{ album.assets.length }} assets</div>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" scoped src="./style.scss" />
