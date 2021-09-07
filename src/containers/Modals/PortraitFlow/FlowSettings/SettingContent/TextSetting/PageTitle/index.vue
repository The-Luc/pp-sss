<template>
  <div class="page-title">
    <input-title
      :disabled="!isPageTitleOn"
      title-name="Page Title:"
      :title-value="pageTitle"
      @change="onChangeTitle"
    ></input-title>
    <pp-select
      :selected-val="statusPageTitleVal"
      :items="statusPageTitle"
      @change="onChangeStatus"
    ></pp-select>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
