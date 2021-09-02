<template>
  <div
    class="theme-item"
    :class="{ 'theme-item-active': selectedThemeId === theme.id }"
  >
    <img
      v-if="theme.previewImageUrl"
      class="theme-item-img"
      :src="theme.previewImageUrl"
      alt="theme"
      @click="onClick"
    />
    <div class="theme-item-name">{{ theme.name }}</div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
