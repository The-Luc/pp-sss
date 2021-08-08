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
      <div class="title-container">
        Select from your existing albums or start tying to create a new one
      </div>
      <div class="select-container">
        <AlbumAutocomplete :albums="albums" />
      </div>
      <div class="btn-container">
        <PpButton class="button" is-active>
          Add Media
        </PpButton>
        <PpButton class="button button-cancel" @click.native="onCancel">
          Cancel
        </PpButton>
      </div>
    </div>
  </v-dialog>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
