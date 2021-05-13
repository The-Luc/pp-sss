<template>
  <Modal title="Delete?" width="425">
    <div class="text-300 item-title">
      Please confirm that you want to delete sheet <span>"{{ idSheet }}"</span>
    </div>
    <div class="d-flex justify-space-between">
      <PpButton class="mr-3 w-100 btn-detail" @click.native="onCloseModal"
        >No, Do not Delete</PpButton
      >
      <PpButton
        class="w-100"
        is-active
        @click.native="onDeleteSheet(idSheet, idSection)"
        >Yes, Delete Sheet</PpButton
      >
    </div>
  </Modal>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
