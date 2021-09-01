<template>
  <div class="start-page">
    <div class="label">Start Portrait Flow on Page:</div>

    <PpSelect
      id="pages"
      container="#pages"
      :items="pages"
      :selected-val="page"
      @change="onStartPageChange"
    />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
