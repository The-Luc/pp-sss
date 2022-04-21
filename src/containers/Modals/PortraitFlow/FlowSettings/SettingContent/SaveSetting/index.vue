<template>
  <div class="save-setting-container">
    <div class="setting-title">
      Saved Settings
    </div>
    <div
      v-for="(savedSetting, index) in savedSettings"
      :key="index"
      class="setting"
    >
      <div class="setting-info">
        <div class="name">{{ savedSetting.name }}</div>
        <div class="date">saved: {{ savedSetting.savedDate }}</div>
      </div>
      <div class="setting-load">
        <v-btn class="ma-2 load" outlined @click="loadSetting(savedSetting.id)">
          Load Settings
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
