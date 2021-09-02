<template>
  <div class="portrait-setting-container">
    <LayoutSetting
      :layout-settings="flowSettings.layoutSettings"
      @change="onLayoutChange"
    />
    <TeacherSetting />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
