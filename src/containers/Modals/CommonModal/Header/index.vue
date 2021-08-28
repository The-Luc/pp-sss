<template>
  <v-card-title
    :class="['pp-modal-title', { 'pp-modal-title-theme': isThemeUsed }]"
  >
    <span v-if="isThemeUsed" class="top-bg" />

    <span class="text-title">{{ title }}</span>

    <v-icon v-if="isCloseIconDisplayed" class="icon-close" @click="onCancel">
      close
    </v-icon>
  </v-card-title>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
