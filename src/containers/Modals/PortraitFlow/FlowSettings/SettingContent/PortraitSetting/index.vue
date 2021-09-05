<template>
  <div class="portrait-setting-container">
    <layout-setting
      :layout-settings="flowSettings.layoutSettings"
      :is-single-folder="isSingleFolder"
      @change="onLayoutChange"
    />
    <teacher-setting
      :teacher-settings="flowSettings.teacherSettings"
      :layout="layout"
      :is-single-folder="isSingleFolder"
      @change="onTeacherSettingsChange"
    />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
