<template>
  <div class="process-bar">
    <span
      v-if="isShowDot"
      class="dot"
      :style="[
        !!color && {
          backgroundColor: color
        }
      ]"
    ></span>

    <BlockBar :class="isShowDot && 'use-dot'" :items="processItems" />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" scoped src="./style.scss"></style>
