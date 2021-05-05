<template>
  <v-col class="col-9 section-name">
    <span class="dot" :style="'background-color: ' + sectionColor"></span>
    <img src="@/assets/icons/collapse.svg" data-toggle="collapse" />
    <input
      type="text"
      maxlength="50"
      v-model="sectionNameCurrent"
      @click="$event.stopPropagation()"
      @keyup.enter="saveTitle($event)"
      @keyup.esc="keyUpEsc($event)"
      @blur="saveTitle"
    />
  </v-col>
</template>

<script src="./script.js"></script>

<style lang="scss">
@import './style.scss';
</style>
