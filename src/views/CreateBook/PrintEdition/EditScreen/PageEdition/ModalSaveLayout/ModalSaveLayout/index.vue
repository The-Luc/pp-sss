<template>
  <Modal title="Save Layout" width="560" :is-close-out-side="false">
    <div class="modal-save-layout">
      <div class="container-input">
        <div class="input-title">Add a name for your layout:</div>
        <div class="input">
          <input v-model="layoutName" type="text" />
        </div>
      </div>
      <div class="container-btn">
        <PpButton is-active class="btn-first" @click="saveLayout">
          Save Layout
        </PpButton>
        <PpButton is-active class="btn-cancel" @click="onCancel">
          Cancel
        </PpButton>
      </div>
    </div>
  </Modal>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
