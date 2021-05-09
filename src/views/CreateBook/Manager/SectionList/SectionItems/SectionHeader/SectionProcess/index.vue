<template>
  <v-col class="col-3 section-process">
    <span class="dot" :style="'background-color: ' + color"></span>
    <span class="process first"></span>
    <span class="process"></span>
    <span class="process last"></span>

    <span class="first-release">{{ releaseDate }}</span>
    <img :src="moreIcon" @click="toggleMenu" />
    <Action
      :release-date="releaseDate"
      nudge-width="160"
      :items="items"
      :menu-x="menuX"
      :menu-y="menuY"
      :section-id="sectionId"
    />
  </v-col>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" />
