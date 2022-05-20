<template>
  <div id="layout-mapping">
    <select-layouts
      v-show="isSelectingLayout"
      @onConfirm="handleSelectedLayouts"
      @onCancel="showConfirmCancel"
    />

    <map-elements
      v-if="!isSelectingLayout"
      :print-layout="printLayout"
      :digital-layout="digitalLayout"
      :config="mappingConfig"
      @onCancel="showConfirmCancel"
      @onClose="onClose"
    />

    <confirm-action
      v-if="isConfirmCancelDisplay"
      header="Please Confirm"
      cancel-content="No, return to layout mapping"
      action-content="Yes, cancel mapping"
      width="600"
      @onAccept="onCancel"
      @onCancel="onCloseConfirmCancel"
    >
      Be aware that if you cancel, all of the print to digital mapping <br />
      connections that you’ve created will NOT be saved.
      <p style="margin-top: 20px">
        Do you wish to proceed?
      </p>
    </confirm-action>
  </div>
</template>

<script src="./script.js" />
