<template>
  <div class="theme-item">
    <img
      v-if="theme.imageUrl"
      class="theme-item-img"
      :class="{ 'theme-item-img-active': selectedThemeId === theme.id }"
      :src="require(`@/assets/image/themes/${theme.imageUrl}`)"
      @click="onClick"
    />
    <div class="theme-item-name">{{ theme.name }}</div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
