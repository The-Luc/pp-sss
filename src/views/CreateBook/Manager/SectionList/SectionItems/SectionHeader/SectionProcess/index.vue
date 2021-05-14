<template>
  <v-col class="col-3 section-process">
    <span
      class="dot"
      :style="[status >= 0 && { backgroundColor: sectionColor }]"
    ></span>
    <span
      class="process in-progress"
      :style="[status >= 1 && { backgroundColor: sectionColor }]"
    ></span>
    <span
      class="process completed"
      :style="[status >= 2 && { backgroundColor: sectionColor }]"
    ></span>
    <span
      class="process approved"
      :style="[status >= 3 && { backgroundColor: sectionColor }]"
    ></span>

    <span class="first-release">{{ dueDate }}</span>
    <img :src="moreIcon" @click="toggleMenu" />
    <Action
      :due-date="dueDate"
      :is-show-delete="isShowDelete"
      :section-name="sectionName"
      :items="items"
      :menu-x="menuX"
      :menu-y="menuY"
      :status="status"
      :section-id="sectionId"
    />
  </v-col>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" />
