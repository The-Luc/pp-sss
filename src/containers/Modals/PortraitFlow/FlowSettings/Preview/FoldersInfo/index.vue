<template>
  <div class="folders-info">
    <div>Folder(s):</div>
    <div class="folder-text-wrapper">
      <div ref="folderText" class="emphasize folder-text">
        {{ folderNameText }}
      </div>
      <folder-name v-if="isShowMoreDisplayed" :folder-names="folderNames" />
    </div>
    <div>Total Portraits:</div>
    <div class="emphasize">{{ totalPortraits }}</div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
