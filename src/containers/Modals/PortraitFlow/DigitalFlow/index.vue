<template>
  <div>
    <common-flow
      :is-open="isPortraitFlowDisplayed"
      :selected-folders="selectedFolders"
      :flow-settings="flowSettings"
      :init-flow-option="initFlowOption"
      :initial-layout-setting="initialLayoutSetting"
      :start-number="startPage"
      :required-pages="requiredFrames"
      :preview-portraits-range="previewPortraitsRange"
      :container="container"
      :is-digital="true"
      @cancel="onCancel"
      @accept="onApply"
      @startChange="onStartChange"
      @settingChange="onSettingChange"
      @flowSettingChange="onFlowSettingChange"
      @pageSettingChange="onFrameSettingChange"
      @screenSettingChange="onScreenSettingChange"
      @updateRequirePage="onRequireFrameUpdate"
    ></common-flow>

    <apply-portrait
      :is-digital="true"
      :is-open-modal="isShowApplyPortrait"
      @apply="onApply"
      @cancel="onCancelApplyPortrait"
    ></apply-portrait>
  </div>
</template>

<script src="./script.js"></script>
