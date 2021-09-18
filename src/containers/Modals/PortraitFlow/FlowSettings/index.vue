<template>
  <div class="setting-wrapper">
    <Preview
      :selected-folders="selectedFolders"
      :required-pages="requiredPages"
      :displayed-page-no="displayedPageNo"
      :flow-settings="flowSettings"
      :preview-portraits-range="previewPortraitsRange"
      :is-digital="isDigital"
      @startPageChange="onStartPageChange"
      @showPreview="onShowPreview"
    />

    <settings
      :saved-settings="savedSettings"
      :current-tab="currentTab"
      @settingTabChange="onSettingTabChange"
      @saveSetting="onSaveSettings"
    ></settings>

    <setting-content
      :current-tab="currentTab"
      :flow-settings="flowSettings"
      :selected-folders="selectedFolders"
      :saved-settings="savedSettings"
      :is-digital="isDigital"
      @settingChange="onSettingChange"
      @flowSettingChange="onFlowSettingChange"
      @pageSettingChange="onPageSettingChange"
      @loadSetting="onLoadSetting"
    />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
