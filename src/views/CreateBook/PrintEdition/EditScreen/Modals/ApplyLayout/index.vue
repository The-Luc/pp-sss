<template>
  <div id="modal-apply-print-layout">
    <confirm-apply-layout
      v-if="isConfirmApplyShown"
      :layout="{}"
      @onApply="onConfirmApply"
      @onCancel="onCancel"
    />
    <select-page
      v-if="isSelectPageShown"
      :sheet="currentSheet"
      @onApply="onApplyOfSelectPage"
    />
    <scale-fit-option v-if="isScaleFitShown" />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
