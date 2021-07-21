<template>
  <Modal title="Save Layout" width="560" :is-close-out-side="false">
    <div class="modal-select-page-of-layout">
      <PpButton is-active class="btn-first" @click="onSelectPageOfLayout">
        Save Spread Layout
      </PpButton>
      <PpButton is-active @click="onSelectPageOfLayout">
        Save Left Hand Page Layout
      </PpButton>
      <PpButton is-active @click="onSelectPageOfLayout">
        Save Right Hand Page Layout
      </PpButton>
      <PpButton is-active class="btn-cancel" @click="onCancel">
        Cancel
      </PpButton>
    </div>
  </Modal>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
