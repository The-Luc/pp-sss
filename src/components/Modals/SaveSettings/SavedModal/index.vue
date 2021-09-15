<template>
  <div id="saved-setting">
    <common-modal
      class="modal-saved-setting"
      container="#saved-setting"
      :is-open-modal="isOpenModal"
      :is-header-displayed="false"
      :is-close-out-side="false"
      :is-footer-displayed="false"
      :is-close-icon-displayed="false"
      width="365"
    >
      <div class="saved-message">Your settings have been saved</div>
    </common-modal>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
