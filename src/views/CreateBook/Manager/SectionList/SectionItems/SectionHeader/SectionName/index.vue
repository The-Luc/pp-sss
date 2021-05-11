<template>
  <v-col class="col-9 section-name">
    <DragControl :id="'section' + sectionId" />

    <span class="dot" :style="'background-color: ' + sectionColor"></span>
    <img src="@/assets/icons/collapse.svg" data-toggle="collapse" />
    <span>{{ sectionName }}</span>
  </v-col>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
