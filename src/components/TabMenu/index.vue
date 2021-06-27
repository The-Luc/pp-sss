<template>
  <v-tabs v-model="tabName" class="pp-tab-menu" @change="onChange">
    <slot />
  </v-tabs>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
