<template>
  <div class="thumbnail-view-header">
    <div class="header-container" @click="isOpen = !isOpen">
      <div
        class="header-color"
        :style="{ 'background-color': section.color }"
      ></div>
      <v-icon v-if="isOpen">arrow_drop_down</v-icon>
      <v-icon v-else>arrow_right</v-icon>
      <div class="header-name">
        {{ section.name }}
        <span>({{ section.sheets.length }})</span>
      </div>
    </div>

    <div v-show="isOpen" class="sheet-container">
      <slot />
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
