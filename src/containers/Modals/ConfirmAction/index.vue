<template>
  <Modal :is-close-out-side="false" :title="header" :width="width">
    <div class="confirm-action">
      <div class="text">
        <slot></slot>
      </div>
      <div class="btn-container">
        <button class="btn btn-action" @click="onAction">
          {{ actionContent }}
        </button>
        <button class="btn btn-cancel" @click="onCancel">
          {{ cancelContent }}
        </button>
      </div>
    </div>
  </Modal>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" scoped />
