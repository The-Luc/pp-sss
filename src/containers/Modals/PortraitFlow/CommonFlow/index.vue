<template>
  <div
    v-if="!isShowMappingWelcome"
    id="portrait-flow"
    :class="{ preview: isPreviewDisplayed }"
  >
    <CommonModal
      width="1162"
      container="#portrait-flow"
      :accept-text="`Apply Portraits to ${isDigital ? 'Frames' : 'Pages'}`"
      :title="title"
      :is-open-modal="isOpen"
      :is-back-icon-displayed="isPreviewDisplayed"
      :is-close-icon-displayed="!isPreviewDisplayed"
      :is-accept-button-disabled="isAcceptButtonDisabled"
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
        :trigger-tab="triggerTab"
        @showPreview="onShowPreview"
        @settingChange="onSettingChange"
        @saveSettings="onSaveSettings"
        @startPageChange="onStartChange"
        @flowSettingChange="onFlowSettingChange"
        @pageSettingChange="onPageSettingChange"
        @screenSettingChange="onScreenSettingChange"
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

    <save-settings-modal
      :is-open-modal="isOpenSaveSettingsModal"
      @cancel="onCancelSaveSettings"
      @SaveSettings="onSaveSettings"
    ></save-settings-modal>

    <saved-modal :is-open-modal="isOpenModalSuccess" :message="message">
    </saved-modal>
  </div>

  <confirm-action
    v-else
    header="Portrait Flow"
    action-content="Get Started"
    width="550"
    :hide-cancel="true"
    @onAccept="onAcceptMappingWelcome"
  >
    <p>Configure the following portrait sets:</p>
    <div class="collection-name-wrap">
      <p
        v-for="folder in selectedFolders"
        :key="folder.id"
        class="collection-name"
      >
        {{ folder.name }}
      </p>
    </div>
    <p class="portrait-note"></p>
  </confirm-action>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
