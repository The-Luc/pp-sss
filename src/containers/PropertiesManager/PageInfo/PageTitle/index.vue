<template>
  <div class="page-title">
    <InputTitle
      maxlength="50"
      :title-name="!isLink ? 'Left hand page title:' : titleName"
      :disabled="disabled"
      :title-value="leftTitleValue"
      @change="onChangeLeftTitle"
    />
    <InputTitle
      v-if="!isLink"
      maxlength="50"
      title-name="Right hand page title:"
      :title-value="rightTitleValue"
      @change="onChangeRightTitle"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" scoped src="./style.scss" />
