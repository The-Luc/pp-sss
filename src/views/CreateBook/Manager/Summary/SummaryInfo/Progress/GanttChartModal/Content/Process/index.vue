<template>
  <div class="process">
    <Merchandising v-if="isSale" />
    <Sections />
    <Production />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped></style>
