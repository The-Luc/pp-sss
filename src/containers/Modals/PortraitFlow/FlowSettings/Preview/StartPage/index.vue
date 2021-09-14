<template>
  <div class="start-page" :class="{ digital: isDigital }">
    <div class="label">Start Portrait Flow on {{ containerName }}:</div>

    <PpSelect
      id="pages"
      container="#pages"
      :items="selectedPages"
      :selected-val="selectedPage"
      @change="onStartPageChange"
    />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
