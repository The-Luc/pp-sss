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
      @onCancel="onCancel"
    />
    <scale-fit-option
      v-if="isScaleFitShown"
      @onScale="onScale"
      @onFit="onFit"
      @onCancel="onCancel"
    />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
