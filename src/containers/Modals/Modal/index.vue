<template>
  <v-dialog
    :persistent="!isCloseOutSide"
    :value="isOpenModal"
    content-class="pp-modal"
    :width="width"
    :attach="container"
    @click:outside="onCloseModal"
    @keydown="onKeyDown"
  >
    <v-card>
      <Header
        v-if="isShowHeader"
        :theme-modal="themeModal"
        :title="title"
        :show-icon-close="showIconClose"
        @onCloseModal="onCloseModal"
      />
      <v-card-text :class="{ 'card-text-theme-modal': themeModal }">
        <slot></slot>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
