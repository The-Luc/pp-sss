<template>
  <Backgrounds
    :background-types="backgroundTypes"
    :backgrounds="backgrounds"
    :selected-type="selectedType"
    :selected-page-type="selectedPageType"
    :applied-background="appliedBackground"
    :is-half-sheet="isHalfSheet"
    @typeChange="onChangeType"
    @pageTypeChange="onChangePageType"
    @applyBackground="onApplyChosenBackground"
    @close="onClose"
  />
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
