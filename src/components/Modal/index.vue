<template>
  <v-dialog
    :value="isOpenModal"
    content-class="pp-modal"
    :width="width"
    @click:outside="onCloseModal"
  >
    <v-card>
      <Header
        :title="title"
        :show-icon-close="showIconClose"
        @onCloseModal="onCloseModal"
      />
      <v-card-text>
        <slot></slot>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
