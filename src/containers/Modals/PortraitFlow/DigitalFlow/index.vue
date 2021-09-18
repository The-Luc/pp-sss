<template>
  <common-flow
    :is-open="isOpen"
    :selected-folders="selectedFolders"
    :flow-settings="flowSettings"
    :init-flow-option="initFlowOption"
    :initial-layout-setting="initialLayoutSetting"
    :start-number="startPage"
    :required-pages="requiredPages"
    :preview-portraits-range="previewPortraitsRange"
    :is-warning-displayed="isWarningDisplayed"
    :warning-text="warningText"
    :container="container"
    :is-digital="true"
    @cancel="onCancel"
    @accept="onApply"
    @startChange="onStartPageChange"
    @settingChange="onSettingChange"
    @flowSettingChange="onFlowSettingChange"
    @pageSettingChange="onPageSettingChange"
    @updateRequirePage="onRequirePageUpdate"
    @closeWarning="onFlowWarningClose"
  ></common-flow>
</template>

<script src="./script.js"></script>
