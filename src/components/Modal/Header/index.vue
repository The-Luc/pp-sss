<template>
  <v-card-title class="pp-modal-title">
    <span class="top-bg" />
    <span class="text-size-xl text-title">{{ title }}</span>
    <v-icon v-show="showIconClose" class="icon-close" @click="onCloseModal">
      mdi-close
    </v-icon>
  </v-card-title>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
