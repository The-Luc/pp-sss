<template>
  <div class="loading">
    <v-overlay :opacity="0.7" z-index="99999">
      <v-progress-circular
        class="circle"
        :size="50"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
