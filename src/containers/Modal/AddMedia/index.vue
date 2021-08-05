<template>
  <v-dialog
    id="add-media"
    v-model="isOpenModal"
    content-class="modal-add-media"
    persistent
    max-width="425"
  >
    <div class="header">
      Add Media
    </div>
    <div class="content">
      <div class="select-container"></div>
      <div class="btn-container">
        <PpButton class="button" is-active>
          Add Media
        </PpButton>
        <PpButton class="button button-cancel">
          Cancel
        </PpButton>
      </div>
    </div>
  </v-dialog>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
