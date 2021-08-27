<template>
  <div id="portrait-folow">
    <CommonModal
      title="Portrait Flow"
      accept-text="Apply Portraits to Pages"
      container="#portrait-folow"
      width="1162"
      :is-open-modal="isOpen"
      @cancel="onCancel"
      @accept="onAccept"
    >
      <div class="preview"></div>
      <div class="settings"></div>
      <div class="setting-content"></div>
    </CommonModal>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
