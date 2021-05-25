<template>
  <div class="tool-popover-container">
    <div class="tool-popover-header">
      <p class="mb-0 ml-3 text-500 text-size-md">{{ title }}</p>
    </div>
    <div class="tool-popover-action">
      <slot name="action" />
    </div>
    <div class="tool-popover-content">
      <slot name="content" />
    </div>
    <div class="tool-popover-footer">
      <v-btn class="footer-btn cancel" @click="onCancel">Cancel</v-btn>
      <v-btn class="footer-btn action" @click="onAction">{{
        actionText
      }}</v-btn>
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
