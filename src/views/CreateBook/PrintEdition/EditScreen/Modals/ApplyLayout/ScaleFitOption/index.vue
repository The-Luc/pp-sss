<template>
  <Modal title="Warning" width="524" :is-close-out-side="false">
    <div class="modal-adapt-layout">
      <div class="modal-adapt-layout-title">
        <div>
          This template was designed in a different scale. How would you like to
          apply it?
        </div>
      </div>
      <div class="container-btn">
        <PpButton is-active @click="onScale">
          Scale to Canvas
        </PpButton>
        <PpButton is-active @click="onFit">
          Fit to Canvas
        </PpButton>
        <PpButton class="btn-cancel" @click="onCancel">
          Cancel
        </PpButton>
      </div>
    </div>
  </Modal>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
