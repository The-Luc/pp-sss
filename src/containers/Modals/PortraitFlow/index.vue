<template>
  <div id="portrait-folow">
    <CommonModal
      title="Portrait Flow"
      accept-text="Apply Portraits to Pages"
      container="#portrait-folow"
      width="1162"
      :is-open-modal="isOpen"
      :is-disable-accept="false"
      @cancel="onCancel"
      @accept="onAccept"
    >
      <Preview :selected-folders="selectedFolders" />

      <Settings
        :current-tab="currentTab"
        @settingTabChange="onSettingTabChange"
        @saveSetting="onSaveSettings"
      />

      <SettingContent :current-tab="currentTab" />
    </CommonModal>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
