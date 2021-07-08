<template>
  <Backgrounds
    :background-types="backgroundTypes"
    :backgrounds="backgrounds"
    :theme-id="currentThemeId"
    :applied-background="alreadyAppliedBackground"
    :is-half-sheet="isHalfSheet"
    @typeChange="onChangeType"
    @pageTypeChange="onChangePageType"
    @applyBackground="onApplyChosenBackground"
    @close="onClose"
  />
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
