<template>
  <v-col class="col-3 section-process">
    <ProcessBar :color="section.color" :status="section.status" />

    <span class="first-release">{{ section.dueDate }}</span>
    <img :src="moreIcon" @click="toggleMenu" />

    <Action
      :due-date="section.dueDate"
      :section-name="section.name"
      :items="items"
      :menu-x="menuX"
      :menu-class="menuClass"
      :menu-y="menuY"
      :status="section.status"
      :section-id="section.id"
    />
  </v-col>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" />
