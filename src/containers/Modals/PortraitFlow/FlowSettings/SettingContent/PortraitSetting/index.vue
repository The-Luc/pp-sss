<template>
  <div class="portrait-setting-container">
    <layout-setting
      :layout-settings="flowSettings.layoutSettings"
      @change="onLayoutChange"
    />
    <teacher-setting />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
