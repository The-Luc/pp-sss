<template>
  <div>
    <!-- CONFIRM MODAL FOR CUSTOM MAPPINGS -->
    <confirm-action
      v-if="isShowCustomConfirm"
      header="Warning"
      action-content="Yes, apply layout"
      width="550"
      @onAccept="onAcceptCustomConfirm"
      @onCancel="onCloseCustomConfirm"
    >
      This will apply a new layout and discard any design you currently have.
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
      connections on the corresponding print pages will be broken.
      <p style="margin-top: 20px">
        Do you wish to proceed?
      </p>
    </confirm-action>

    <!-- CONFIRM MODAL FOR APPLYING A LAYOUT ON LAYOUT MAPPING SHEET -->
    <confirm-action
      v-if="isShowMapLayoutConfirm"
      header="Warning"
      action-content="Yes, apply layout"
      width="550"
      @onAccept="onAcceptMapLayoutConfirm"
      @onCancel="onCloseMapLayoutConfirm"
    >
      This will apply a new layout and discard any design you currently have on
      these digital frames AND the corresponding pages in your print edition.
      <p style="margin-top: 20px">
        Do you wish to proceed?
      </p>
    </confirm-action>

    <!-- MAPPED LAYOUT CONFIRM MODAL -->
    <option-apply-map-layout
      v-if="isShowMapLayoutOption"
      :img-urls="imgUrls"
      :is-digital="true"
      header="Print Edition"
      @onApplyPrimary="onApplyPrimaryOnly"
      @onApplyBoth="onApplyBoth"
      @onCancel="onCloseMapLayout"
    >
    </option-apply-map-layout>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" scoped />
