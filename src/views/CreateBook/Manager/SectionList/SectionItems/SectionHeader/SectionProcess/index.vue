<template>
  <v-col class="col-3 section-process">
    <span class="dot" :style="'background-color: ' + color"></span>
    <span class="process first"></span>
    <span class="process"></span>
    <span class="process last"></span>

    <span class="first-release">{{ releaseDate }}</span>
    <Menu
      :id="sectionId"
      :current-id="currentId"
      :src="moreIcon"
      nudge-width="160"
      :items="items"
      @onIconClick="onIconClick"
      @onItemClick="onItemClick"
    />
    <Action
      :is-open-calendar="isOpenCalendar"
      :calendar-width="calendarWidth"
      :release-date="releaseDate"
      :calendar-position="calendarPosition"
      @onMenuToggle="onMenuToggle"
    />
  </v-col>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" />
