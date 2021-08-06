<template>
  <v-dialog
    id="remove-photo"
    v-model="open"
    content-class="modal-remove-photo"
    persistent
    :width="465"
    @keydown.esc="onCancel"
  >
    <v-card>
      <v-card-title class="pp-modal-title">
        <span class="top-bg" />
        <span class="text-size-xl text-title">
          Remove Photo?
        </span>
      </v-card-title>
      <v-card-text class="pp-modal-content">
        <div>
          Note: This action will remove the photo from the Photos palette but
          will not remove it from the layout.
        </div>
        <div>
          To remove the photo from the layout, go to the Reset tab in
          ImageProperties.
        </div>
      </v-card-text>
      <v-card-actions class="pp-modal-action">
        <PpButton class="pp-button remove-btn" is-active @click="onRemove">
          Remove Photo
        </PpButton>
        <PpButton class="pp-button cancel-btn" @click="onCancel">
          Cancel
        </PpButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
