<template>
  <Modal :is-close-out-side="false" title="Warning" width="559">
    <div class="override-layout">
      <div class="text text--1">
        This will apply a new layout and discard any design you currently have.
      </div>
      <div class="text text--2">Do you wish to processed?</div>
      <div class="btn-container">
        <button class="btn btn-action" @click="onAction">
          Yes, apply layout
        </button>
        <button class="btn btn-cancel" @click="onCancel">Cancel</button>
      </div>
    </div>
  </Modal>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" scoped />
