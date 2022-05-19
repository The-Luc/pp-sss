<template>
  <Modal title="Warning" width="560" :is-close-out-side="false">
    <div class="modal-reset-layout">
      <div class="modal-reset-layout-title">
        <div>
          This will apply a new layout and discard any design you currently
          have.
        </div>
        <div>Do you wish to proceed?</div>
      </div>
      <div class="container-btn">
        <PpButton is-active @click="onApplyLayout">
          Yes, apply layout
        </PpButton>
        <PpButton is-active class="btn-cancel" @click="onCancel">
          Cancel
        </PpButton>
      </div>
    </div>
  </Modal>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
