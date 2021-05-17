<template>
  <div :class="['btn-exit', 'pointer', { 'hidden-btn': !showExit }]">
    <img
      class="arrow-left"
      :src="ICON_LOCAL.ARROW_LEFT"
      alt="arrow_left"
      width="14"
    />
    <p class="text text-center mb-0">
      Exit Yearbook Builder
    </p>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" scoped src="./style.scss" />
