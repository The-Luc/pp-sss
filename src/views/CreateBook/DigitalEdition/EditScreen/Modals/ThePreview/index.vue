<template>
  <div id="the-preview">
    <common-modal
      container="#the-preview"
      :can-close-outside="canCloseOutside"
      :is-open-modal="true"
      :is-header-displayed="false"
      :is-footer-displayed="false"
      @cancel="onClose"
    >
      <div class="content-container" :class="{ vertical: isVertical }">
        <slot></slot>
      </div>
    </common-modal>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
