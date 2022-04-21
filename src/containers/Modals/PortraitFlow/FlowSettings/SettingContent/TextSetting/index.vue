<template>
  <div class="setting-container">
    <div class="title-setting">
      Text Settings
    </div>
    <page-title :text-settings="textSettings" @change="onChange"></page-title>
    <properties
      :disabled="!textSettings.isPageTitleOn"
      :font-settings="textSettings.pageTitleFontSettings"
      @change="onChangePageTitle"
    ></properties>
    <text-margin :text-settings="textSettings" @change="onChange"></text-margin>
    <div class="name-text">Name Text:</div>
    <properties
      :font-settings="textSettings.nameTextFontSettings"
      @change="onChangeNameText"
    ></properties>
    <display-position
      :text-settings="textSettings"
      @change="onChange"
    ></display-position>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
