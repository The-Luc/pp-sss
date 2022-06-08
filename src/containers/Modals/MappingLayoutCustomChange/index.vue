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
      </div>
      <div class="show-again-message">
        <v-checkbox
          v-model="checkbox"
          label="Don't show this message again"
          :ripple="false"
          dense
          color="#42738d"
        ></v-checkbox>
      </div>
    </div>
  </Modal>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" scoped />
