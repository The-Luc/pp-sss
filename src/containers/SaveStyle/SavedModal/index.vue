<template>
  <v-dialog
    :value="isOpenModal"
    :persistent="true"
    content-class="modal-saved-style"
    :width="350"
  >
    <div class="saved-message">Your style has been saved</div>
  </v-dialog>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
