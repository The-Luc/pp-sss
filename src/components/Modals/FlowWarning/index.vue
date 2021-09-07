<template>
  <div id="flow-warning">
    <CommonModal
      title="Warning"
      accept-text="Continue"
      container="#portrait-folder"
      width="796"
      :is-open-modal="isOpenModal"
      @cancel="onCancel"
      @accept="onSelect"
    >
      hahah
    </CommonModal>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
