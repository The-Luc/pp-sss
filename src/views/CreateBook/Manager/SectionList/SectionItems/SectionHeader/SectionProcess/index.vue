<template>
  <v-col class="col-3 section-process">
    <span class="dot" :style="'background-color: '+ color"></span>
    <span class="process first"></span>
    <span class="process"></span>
    <span class="process last"></span>

    <span class="first-release">{{ releaseDate }}</span>

    <img src="@/assets/icons/more.svg" />
  </v-col>
</template>

<script src="./script.js"></script>

<style lang="scss">
@import './style.scss';
</style>
