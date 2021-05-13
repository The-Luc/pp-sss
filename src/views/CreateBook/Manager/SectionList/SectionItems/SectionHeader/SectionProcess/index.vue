<template>
  <v-col class="col-3 section-process">
    <span
      class="dot"
      :style="[sectionStatus >= 0 && { backgroundColor: color }]"
    ></span>
    <span
      class="process in-progress"
      :style="[sectionStatus >= 1 && { backgroundColor: color }]"
    ></span>
    <span
      class="process completed"
      :style="[sectionStatus >= 2 && { backgroundColor: color }]"
    ></span>
    <span
      class="process approved"
      :style="[sectionStatus >= 3 && { backgroundColor: color }]"
    ></span>

    <span class="first-release">{{ releaseDate || '06/08/21' }}</span>
    <img :src="moreIcon" @click="toggleMenu" />
    <Action
      :release-date="releaseDate"
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
