<template>
  <v-tabs-items v-model="currentTab">
    <v-tab-item>
      <portrait-setting
        :selected-folders="selectedFolders"
        :flow-settings="flowSettings"
        :is-digital="isDigital"
        @portraitSettingChange="onSettingChange"
      />
    </v-tab-item>
    <v-tab-item>
      <text-setting
        :text-settings="flowSettings.textSettings"
        @portraitSettingChange="onSettingChange"
      ></text-setting>
    </v-tab-item>
    <v-tab-item>
      <image-settings
        :image-settings="flowSettings.imageSettings"
        @portraitSettingChange="onSettingChange"
      ></image-settings>
    </v-tab-item>
    <v-tab-item>
      <digital-flow-settings
        v-if="isDigital"
        :selected-folders="selectedFolders"
        :flow-settings="flowSettings"
        @settingChange="onSettingChange"
        @flowSettingChange="onFlowSettingChange"
        @pageSettingChange="onPageSettingChange"
        @screenSettingChange="onScreenSettingChange"
      ></digital-flow-settings>
      <print-flow-settings
        v-else
        :selected-folders="selectedFolders"
        :flow-settings="flowSettings"
        @settingChange="onSettingChange"
        @flowSettingChange="onFlowSettingChange"
        @pageSettingChange="onPageSettingChange"
      ></print-flow-settings>
    </v-tab-item>
    <v-tab-item>
      <save-setting
        :saved-settings="savedSettings"
        @loadSetting="onLoadSetting"
      ></save-setting>
    </v-tab-item>
  </v-tabs-items>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
