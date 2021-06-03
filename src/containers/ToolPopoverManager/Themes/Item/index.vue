<template>
  <div
    class="theme-item"
    :class="{ 'theme-item-active': selectedThemeId === theme.id }"
  >
    <img
      v-if="theme.imageUrl"
      class="theme-item-img"
      :src="require(`@/assets/image/themes/${theme.imageUrl}`)"
      alt="theme"
      @click="onClick"
    />
    <div class="theme-item-name">{{ theme.name }}</div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
