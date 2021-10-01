<template>
  <div id="the-preview">
    <common-modal
      container="#the-preview"
      :can-close-outside="false"
      :is-open-modal="true"
      :is-header-displayed="false"
      :is-footer-displayed="false"
    >
      <div class="content-container" :style="{ width: width, height: height }">
        <slot></slot>
      </div>
    </common-modal>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
