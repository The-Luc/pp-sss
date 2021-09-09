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

    <setting-content
      :current-tab="currentTab"
      :flow-settings="flowSettings"
      :selected-folders="selectedFolders"
      @settingChange="onSettingChange"
      @flowSettingChange="onFlowSettingChange"
      @pageSettingChange="onPageSettingChange"
    />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
