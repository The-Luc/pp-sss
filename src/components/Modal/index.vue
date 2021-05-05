<template>
  <v-dialog content-class="pp-modal" v-model="isOpenModal" :width="width">
    <v-card>
      <Header :title="title" :showIconClose="showIconClose" />
      <v-card-text>
        <slot></slot>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script src="./script.js" />

<style lang="scss" src="./style.scss" />
