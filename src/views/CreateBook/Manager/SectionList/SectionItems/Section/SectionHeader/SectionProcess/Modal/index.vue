<template>
  <Modal title="Delete?" width="425">
    <div class="text-300 item-title mb-0">
      Please confirm that you want to delete section
    </div>
    <div class="text-300 item-title">
      <span>"{{ sectionName }}"</span>
      and any sheets contained within.
    </div>
    <div class="d-flex justify-space-between btn-ctn">
      <PpButton class="mr-3 w-100 btn-detail" @click.native="onCloseModal">
        No, Do Not Delete
      </PpButton>
      <PpButton
        class="w-100"
        is-active
        @click.native="onDeleteSection(sectionId)"
      >
        Yes, Delete This Section
      </PpButton>
    </div>
  </Modal>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
