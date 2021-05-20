<template>
  <v-card-title :class="['pp-modal-title', { 'padding-top-26': showTopBg }]">
    <span v-show="showTopBg" class="top-bg" />
    <span class="text-size-xl text-title">{{ title }}</span>
    <v-icon v-if="showIconClose" class="icon-close" @click="onCloseModal">
      close
    </v-icon>
  </v-card-title>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
