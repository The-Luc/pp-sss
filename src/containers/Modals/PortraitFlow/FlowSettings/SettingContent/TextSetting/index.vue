<template>
  <div class="setting-container">
    <div class="title-setting">
      Text Settings
    </div>
    <PageTitle @change="onChange" />
    <Properties @change="onChange" />
    <TextMargin @change="onChange" />
    <div class="name-text">Name Text:</div>
    <Properties @change="onChange" />
    <DisplayPosition @change="onChange" />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
