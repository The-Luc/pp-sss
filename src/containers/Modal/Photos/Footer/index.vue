<template>
  <div class="modal-footer">
    <v-btn class="footer-btn cancel" @click="onCancel">Cancel</v-btn>
    <v-btn class="footer-btn action" :disabled="isDisabled" @click="onSelect"
      >Select</v-btn
    >
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
