<template>
  <v-dialog
    content-class="pp-modal"
    overlay-color="#000"
    overlay-opacity="0.7"
    :persistent="!isCloseOutSide"
    :value="isOpenModal"
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
