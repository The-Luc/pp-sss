<template>
  <v-col class="col-9 section-name">
    <DragDropControl :id="'section' + sectionId" />

    <span class="dot" :style="'background-color: ' + sectionColor"></span>
    <img src="@/assets/icons/collapse.svg" data-toggle="collapse" />
    <input
      v-model="sectionNameCurrent"
      type="text"
      maxlength="50"
      @click="$event.stopPropagation()"
      @keyup.enter="keyUpEnter"
      @keyup.esc="keyUpEsc"
      @blur="saveTitle"
    />
  </v-col>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
