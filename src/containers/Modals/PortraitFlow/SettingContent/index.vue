<template>
  <v-tabs-items v-model="currentTab">
    <v-tab-item><PortraitSetting /></v-tab-item>
    <v-tab-item><TextSetting /></v-tab-item>
    <v-tab-item>Image Settings Component</v-tab-item>
    <v-tab-item>Flow Settings Component</v-tab-item>
  </v-tabs-items>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
