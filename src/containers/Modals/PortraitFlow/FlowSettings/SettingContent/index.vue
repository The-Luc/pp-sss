<template>
  <v-tabs-items v-model="currentTab">
    <v-tab-item>
      <portrait-setting
        :flow-settings="flowSettings"
        @portraitSettingChange="onSettingChange"
      />
    </v-tab-item>
    <v-tab-item>
      <text-setting
        :text-settings="flowSettings.textSettings"
        @portraitSettingChange="onSettingChange"
      ></text-setting>
    </v-tab-item>
    <v-tab-item>Image Settings Component</v-tab-item>
    <v-tab-item>Flow Settings Component</v-tab-item>
  </v-tabs-items>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
