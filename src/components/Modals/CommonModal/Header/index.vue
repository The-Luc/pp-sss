<template>
  <v-card-title
    :class="['pp-modal-title', { 'pp-modal-title-theme': isThemeUsed }]"
  >
    <i
      v-if="isBackIconDisplayed"
      class="material-icons-outlined icon icon-back"
      @click="onBack"
    >
      arrow_circle_left
    </i>

    <span v-if="isThemeUsed" class="top-bg" />

    <span class="text-title">{{ title }}</span>

    <i
      v-if="isCloseIconDisplayed"
      class="material-icons-outlined icon icon-close"
      @click="onCancel"
    >
      close
    </i>
  </v-card-title>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
