<template>
  <Modal class="modal-save-style" title="Save Style" :is-close-out-side="false">
    <div class="modal-save-style-body">
      <div class="style-name">
        <label>{{ title }}</label>
        <input v-model="styleName" maxlength="50" type="text" />
      </div>
    </div>
    <div class="modal-save-style-footer">
      <PpButton is-active @click.native="onSaveStyle">
        Save Style
      </PpButton>
      <PpButton @click.native="onCancel">
        Cancel
      </PpButton>
    </div>
  </Modal>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
