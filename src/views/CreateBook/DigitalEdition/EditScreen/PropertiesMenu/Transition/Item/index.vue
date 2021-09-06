<template>
  <div class="transition-item">
    <the-header
      :first-name="firstFrame"
      :second-name="secondFrame"
      :is-expand="isExpand"
      @toggleExpand="onToggleExpand"
    ></the-header>

    <the-detail v-if="isExpand"></the-detail>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
