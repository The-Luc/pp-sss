<template>
  <v-col class="col-3 section-process">
    <span class="dot" :style="[{ backgroundColor: sectionColor }]"></span>
    <span
      class="process in-progress"
      :style="[
        sectionStatus >= processStatus.IN_PROCESS && {
          backgroundColor: sectionColor
        }
      ]"
    ></span>
    <span
      class="process completed"
      :style="[
        sectionStatus >= processStatus.COMPLETED && {
          backgroundColor: sectionColor
        }
      ]"
    ></span>
    <span
      class="process approved"
      :style="[
        sectionStatus >= processStatus.APPROVED && {
          backgroundColor: sectionColor
        }
      ]"
    ></span>

    <span class="first-release">{{ sectionReleaseDate }}</span>
    <img :src="moreIcon" @click="toggleMenu" />
    <!--<Action
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
    /> -->
  </v-col>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" />
