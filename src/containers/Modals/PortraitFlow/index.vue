<template>
  <div id="portrait-flow" :class="isPreviewDisplayed ? 'preview' : ''">
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
        @showPreview="onShowPreview"
        @settingChange="onSettingChange"
      />

      <FlowPreview
        v-show="isPreviewDisplayed"
        :key="flowReviewCompKey"
        :selected-folders="selectedFolders"
        :flow-settings="flowSettings"
        :required-pages="requiredPages"
      />
    </CommonModal>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
