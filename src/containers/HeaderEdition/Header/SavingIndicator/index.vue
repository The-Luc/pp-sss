<template lang="">
  <div class="auto-save" :class="statusCssClass">
    <div class="content">
      <div class="text autosave-text">{{ message }}</div>
      <div class="bar"></div>
    </div>
    <div class="content text saved-text">
      Saved
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
