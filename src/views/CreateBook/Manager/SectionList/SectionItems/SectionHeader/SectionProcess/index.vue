<template>
  <v-col class="col-3 section-process">
    <span
      class="dot"
      :style="[sectionStatus >= 0 && { backgroundColor: sectionColor }]"
    ></span>
    <span
      class="process in-progress"
      :style="[sectionStatus >= 1 && { backgroundColor: sectionColor }]"
    ></span>
    <span
      class="process completed"
      :style="[sectionStatus >= 2 && { backgroundColor: sectionColor }]"
    ></span>
    <span
      class="process approved"
      :style="[sectionStatus >= 3 && { backgroundColor: sectionColor }]"
    ></span>

    <span class="first-release">{{ sectionReleaseDate }}</span>
    <img :src="moreIcon" @click="toggleMenu" />
    <Action
      :release-date="sectionReleaseDate"
      :is-show-delete="isShowDelete"
      :section-name="sectionName"
      nudge-width="160"
      :items="items"
      :menu-x="menuX"
      :menu-y="menuY"
      :section-status="sectionStatus"
      :section-id="sectionId"
      @onSelectedStatus="onSelectedStatus"
      @onSelectedDate="onSelectedDate"
    />
  </v-col>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" />
