<template>
  <div id="portrait-flow" :class="{ preview: isPreviewDisplayed }">
    <CommonModal
      width="1162"
      container="#portrait-flow"
      :accept-text="`Apply Portraits to ${isDigital ? 'Frames' : 'Pages'}`"
      :title="title"
      :is-open-modal="isOpen"
      :is-back-icon-displayed="isPreviewDisplayed"
      :is-close-icon-displayed="!isPreviewDisplayed"
      :is-accept-button-disabled="false"
      :is-cancel-button-displayed="!isPreviewDisplayed"
      @cancel="onCancel"
      @accept="onAccept"
      @back="onBack"
    >
      <FlowSettings
        v-show="!isPreviewDisplayed"
        :selected-folders="selectedFolders"
        :flow-settings="flowSettings"
        :required-pages="requiredPages"
        :preview-portraits-range="previewPortraitsRange"
        :is-digital="isDigital"
        :saved-settings="savedSettings"
        @showPreview="onShowPreview"
        @settingChange="onSettingChange"
        @saveSettings="onSaveSettings"
        @startPageChange="onStartChange"
        @flowSettingChange="onFlowSettingChange"
        @pageSettingChange="onPageSettingChange"
        @loadSetting="onLoadSetting"
      />

      <FlowPreview
        v-show="isPreviewDisplayed"
        :key="flowReviewCompKey"
        :selected-folders="flowSettings.folders"
        :flow-settings="flowSettings"
        :required-pages="requiredPages"
        :preview-portraits-range="previewPortraitsRange"
        :is-digital="isDigital"
      />
    </CommonModal>

    <flow-warning
      :is-open-modal="isWarningDisplayed"
      :descript-modal="warningText"
      @close="onFlowWarningClose"
    ></flow-warning>

    <save-settings-modal
      :is-open-modal="isOpenSaveSettingsModal"
      @cancel="onCancelSaveSettings"
      @SaveSettings="onSaveSettings"
    ></save-settings-modal>

    <saved-modal :is-open-modal="isOpenModalSuccess"> </saved-modal>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
