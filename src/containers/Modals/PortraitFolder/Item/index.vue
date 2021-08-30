<template>
  <div
    v-if="!isEmpty"
    class="portrait-folder-item"
    :class="{ 'portrait-folder-item-active': isActive }"
    @click="onClick"
  >
    <div class="border-inside"></div>
    <div class="item-info">
      <div class="item-thumb">
        <img :src="portraitFolder.thumbUrl" alt="" />
      </div>
      <div class="item-name">
        {{ portraitFolder.name }}
      </div>
    </div>
    <div class="item-assets-count">
      {{ portraitFolder.assetsCount }} portraits
    </div>
  </div>

  <div v-else class="portrait-folder-item empty-item"></div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
