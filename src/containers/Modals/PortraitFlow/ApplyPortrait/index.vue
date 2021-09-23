<template>
  <div id="apply-warning">
    <common-modal
      title="Please Confirm"
      width="559"
      container="#apply-warning"
      :is-open-modal="isOpenModal"
      :is-theme-used="true"
      :is-close-out-side="false"
      :is-footer-displayed="false"
      :is-close-icon-displayed="false"
    >
      <div class="apply-warning-body">
        Be aware that applying portraits to these pages will<br />
        overwrite everything on the page except the background.
        <br />
        <br />
        Do you wish to proceed?
      </div>

      <template #footer>
        <div class="apply-warning-footer">
          <pp-button class="pp-btn-save" is-active @click="onApply">
            Yes, apply portraits to pages
          </pp-button>
          <pp-button class="pp-btn-cancel" @click="onCancel">
            No, take me back to portrait manager
          </pp-button>
        </div>
      </template>
    </common-modal>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
