<template>
  <div class="setting-wrapper">
    <Preview
      :selected-folders="selectedFolders"
      :required-pages="requiredPages"
      :displayed-page-no="displayedPageNo"
      :flow-settings="flowSettings"
      @startPageChange="onStartPageChange"
      @showPreview="onShowPreview"
    />

    <Settings
      @settingTabChange="onSettingTabChange"
      @saveSetting="onSaveSettings"
    />

    <SettingContent :current-tab="currentTab" />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
