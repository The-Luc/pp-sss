<template>
  <v-col class="col-3 section-process">
    <span class="dot" :style="[{ backgroundColor: section.color }]"></span>
    <span
      class="process in-progress"
      :style="[
        section.status >= processStatus.IN_PROCESS && {
          backgroundColor: section.color
        }
      ]"
    ></span>
    <span
      class="process completed"
      :style="[
        section.status >= processStatus.COMPLETED && {
          backgroundColor: section.color
        }
      ]"
    ></span>
    <span
      class="process approved"
      :style="[
        section.status >= processStatus.APPROVED && {
          backgroundColor: section.color
        }
      ]"
    ></span>

    <span class="first-release">{{ section.dueDate }}</span>
    <img :src="moreIcon" @click="toggleMenu" />
    <Action
      :due-date="section.dueDate"
      :section-name="section.name"
      :items="items"
      :menu-x="menuX"
      :menu-y="menuY"
      :status="section.status"
      :section-id="section.id"
    />
  </v-col>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" />
