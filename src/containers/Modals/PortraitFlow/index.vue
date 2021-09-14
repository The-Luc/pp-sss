<template>
  <div id="portrait-flow" :class="{ preview: isPreviewDisplayed }">
    <CommonModal
      accept-text="Apply Portraits to Pages"
      width="1162"
      container="#portrait-flow"
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
        @showPreview="onShowPreview"
        @settingChange="onSettingChange"
        @saveSettings="onSaveSettings"
        @startPageChange="onStartPageChange"
        @flowSettingChange="onFlowSettingChange"
        @pageSettingChange="onPageSettingChange"
      />

      <FlowPreview
        v-show="isPreviewDisplayed"
        :key="flowReviewCompKey"
        :selected-folders="flowSettings.folders"
        :flow-settings="flowSettings"
        :required-pages="requiredPages"
        :preview-portraits-range="previewPortraitsRange"
      />
    </CommonModal>
    <flow-warning
      :is-open-modal="flowWarning"
      :descript-modal="flowWarningDescript"
      @close="onFlowWarningClose"
    ></flow-warning>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
