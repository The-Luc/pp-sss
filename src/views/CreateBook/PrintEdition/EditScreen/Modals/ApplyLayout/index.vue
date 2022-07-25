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

    <!-- CONFIRM MODAL FOR APPLYING A LAYOUT ON LAYOUT MAPPING SHEET -->
    <confirm-action
      v-if="isShowConfirmForLayoutMapping"
      header="Warning"
      action-content="Yes, apply layout"
      width="550"
      @onAccept="onAcceptForLayoutMapping"
      @onCancel="onCloseConfirmForLayoutMapping"
    >
      This will apply a new layout and discard any design you currently have on
      this spread AND the corresponding frames in your digital edition.
      <p style="margin-top: 20px">
        Do you wish to proceed?
      </p>
    </confirm-action>

    <!-- NON-MAPPED LAYOUT CONFIRM MODAL -->
    <confirm-action
      v-if="isShowNonMapLayoutConfirm"
      header="Warning: Non-Mapped Layout"
      action-content="Yes, apply layout"
      width="550"
      @onAccept="onAcceptNonMapLayout"
      @onCancel="onCloseNonMapLayout"
    >
      This is a non-mapped layout. If you apply this layout all mapping
      connections on the corresponding digital frames will be broken.
      <p style="margin-top: 20px">
        Do you wish to proceed?
      </p>
    </confirm-action>

    <!-- MAPPED LAYOUT CONFIRM MODAL -->
    <option-apply-map-layout
      v-if="isShowMapLayoutConfirm"
      :img-urls="imgUrls"
      @onApplyPrimary="onApplyPrimaryOnly"
      @onApplyBoth="onApplyBoth"
      @onCancel="onCloseMapLayout"
    >
    </option-apply-map-layout>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
