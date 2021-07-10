<template>
  <Backgrounds
    :background-types="backgroundTypes"
    :backgrounds="backgrounds"
    :selected-type="selectedType"
    :selected-page-type="{}"
    :applied-background="appliedBackground"
    :is-page-type-disabled="true"
    :is-page-type-hidden="true"
    @typeChange="onChangeType"
    @applyBackground="onApplyBackground"
    @close="onClose"
  />
</template>

<script src="./script.js" />
