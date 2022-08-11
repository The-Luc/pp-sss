<template>
  <div>
    <common-flow
      :is-open="isPortraitFlowDisplayed"
      :selected-folders="selectedFolders"
      :flow-settings="flowSettings"
      :init-flow-option="initFlowOption"
      :start-number="startPage"
      :required-pages="requiredPages"
      :preview-portraits-range="previewPortraitsRange"
      :is-warning-displayed="isWarningDisplayed"
      :warning-text="warningText"
      :container="container"
      :is-accept-button-disabled="isAcceptButtonDisabled"
      :is-load-mapping="isLoadMapping"
      @cancel="onCancel"
      @accept="onApply"
      @startChange="onStartPageChange"
      @settingChange="onSettingChange"
      @flowSettingChange="onFlowSettingChange"
      @pageSettingChange="onPageSettingChange"
      @updateRequirePage="onRequirePageUpdate"
      @closeWarning="onFlowWarningClose"
    ></common-flow>

    <apply-portrait
      :is-open-modal="isShowApplyPortrait"
      @apply="onApply"
      @cancel="onCancelApplyPortrait"
    ></apply-portrait>

    <flow-warning
      :is-show-fisrt-time="!isPortraitFlowDisplayed"
      :is-open-modal="isWarningDisplayed"
      :descript-modal="warningText"
      @continue="onFlowWarningClose"
      @cancel="onCancel"
    ></flow-warning>
  </div>
</template>

<script src="./script.js"></script>
