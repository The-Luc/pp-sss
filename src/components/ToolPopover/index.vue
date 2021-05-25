<template>
  <div class="tool-popover-container">
    <div class="tool-popover-header">
      <p class="mb-0 ml-3 text-500 text-size-md">{{ title }}</p>
    </div>
    <div class="tool-popover-content">
      <slot />
    </div>
    <div class="tool-popover-footer"></div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" scoped src="./style.scss" />
