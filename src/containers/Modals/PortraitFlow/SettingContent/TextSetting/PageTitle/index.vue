<template>
  <div class="page-title">
    <InputTitle
      title-name="Page Title:"
      :title-value="pageTitle"
      @change="onChangeTitle"
    />
    <PpCombobox
      :items="statusPageTitle"
      :margin-menu="0"
      :nudge-width="61"
      :selected-val="statusPageTitleVal"
      :appended-icon="appendedIcon"
      @change="onChangeStatus"
    />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
