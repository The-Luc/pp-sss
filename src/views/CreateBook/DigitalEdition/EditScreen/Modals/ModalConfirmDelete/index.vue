<template>
  <Modal :is-close-out-side="false" title="Delete?" width="424">
    <div class="confirm-delete">
      <div class="text text--1">
        Please confirm that you want to delete this frame and discard any design
        that you currently have.
      </div>
      <div class="btn-container">
        <button class="btn btn-cancel" @click="onCancel">
          No, Do Not Delete
        </button>
        <button class="btn btn-action" @click="onAction">
          Yes, Delete This Frame
        </button>
      </div>
    </div>
  </Modal>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" scoped />
