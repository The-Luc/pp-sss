<template>
  <Modal title="Apply Layout To…" width="560" :is-close-out-side="false">
    <div class="selecting-container">
      <div class="left-hand">
        <p class="text-center page-text">Page {{ numberPageLeft }}:</p>
        <span class="action" @click="onLeftClick">Left Hand Page</span>
      </div>
      <div class="right-hand">
        <p class="text-center page-text">Page {{ numberPageRight }}:</p>
        <span class="action" @click="onRightClick">Right Hand Page</span>
      </div>
    </div>
  </Modal>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
