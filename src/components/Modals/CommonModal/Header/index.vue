<template>
  <v-card-title
    :class="[
      'pp-modal-title',
      { 'pp-modal-title-theme': isThemeUsed, 'pp-modal-title__dark': isDark }
    ]"
  >
    <em
      v-if="isBackIconDisplayed"
      class="material-icons-outlined icon icon-back"
      @click="onBack"
    >
      arrow_circle_left
    </em>

    <span v-if="isThemeUsed" class="top-bg" />

    <span class="text-title">{{ title }}</span>

    <em
      v-if="isCloseIconDisplayed"
      class="material-icons-outlined icon icon-close"
      @click="onCancel"
    >
      close
    </em>
  </v-card-title>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
