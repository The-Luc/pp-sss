<template>
  <v-col class="col-9 section-name">
    <div class="drag-control invisible">
      <div>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <span class="dot" :style="'background-color: ' + sectionColor"></span>
    <img src="@/assets/icons/collapse.svg" data-toggle="collapse" />
    <span>{{ sectionName }}</span>
  </v-col>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
