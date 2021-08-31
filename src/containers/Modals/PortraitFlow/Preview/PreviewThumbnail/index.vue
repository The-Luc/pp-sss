<template>
  <div class="preview-thumbnail">
    <div class="thumbnail"></div>

    <div class="pages">
      <div class="text clickabe" @click="onMoveToLast">Last Page</div>

      <div class="text currentPage">Page {{ selectedPage }}</div>

      <div class="text clickabe" @click="onMoveToNext">Next Page</div>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
