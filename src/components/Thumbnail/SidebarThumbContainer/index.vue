<template>
  <div class="thumbnail-view-header" :class="disabledCssClass">
    <div class="header-container" @click="toggleSheetsArena">
      <div class="header-color" :style="{ 'background-color': color }"></div>

      <v-icon>{{ arrowIcon }}</v-icon>

      <div class="header-name">{{ name }}</div>
      <span>({{ totalSheet }})</span>
    </div>

    <div v-show="isOpen" class="sheet-container">
      <slot />
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
