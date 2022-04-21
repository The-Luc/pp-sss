<template>
  <Modal title="Save Layout" width="560" :is-close-out-side="false">
    <div class="modal-select-page-of-layout">
      <PpButton
        v-if="!isHalfSheet"
        is-active
        class="btn-first"
        @click="onSelectPageOfLayout(sheetId, 'SHEET')"
      >
        Save Spread Layout
      </PpButton>
      <PpButton
        v-if="isHalfSheet"
        is-active
        class="btn-first"
        @click="onSaveLayoutOfHalfSheet"
      >
        Save Layout
      </PpButton>
      <PpButton
        v-if="!isHalfSheet && !isContainFullBackground"
        is-active
        @click="onSelectPageOfLayout(leftPageId, 'PAGE')"
      >
        Save Left Hand Page Layout
      </PpButton>
      <PpButton
        v-if="!isHalfSheet && !isContainFullBackground"
        is-active
        @click="onSelectPageOfLayout(rightPageId, 'PAGE')"
      >
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
