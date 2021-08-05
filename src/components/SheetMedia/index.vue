<template>
  <div class="sheet-media-container">
    <div v-for="(item, i) in media" :key="i" class="media-item">
      <img :src="item.imageUrl" alt="" />
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" scoped />
