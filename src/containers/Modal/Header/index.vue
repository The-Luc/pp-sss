<template>
  <v-card-title
    :class="['pp-modal-title', { 'pp-modal-title-theme': themeModal }]"
  >
    <span v-show="!themeModal" class="top-bg" />
    <span class="text-size-xl text-title">{{ title }}</span>
    <v-icon v-if="showIconClose" class="icon-close" @click="onCloseModal">
      close
    </v-icon>
  </v-card-title>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
