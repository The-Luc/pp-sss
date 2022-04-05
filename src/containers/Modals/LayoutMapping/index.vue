<template>
  <div id="layout-mapping">
    <select-layouts @onCancel="showConfirmCancel" />

    <confirm-action
      v-if="isConfirmCancelDisplay"
      header="Please Confirm"
      cancel-content="No, return to layout mapping"
      action-content="Yes, cancel mapping"
      :width="600"
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

<style lang="scss" src="./style.scss" scoped />
