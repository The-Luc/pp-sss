<template>
  <div class="process-container">
    <div class="process">
      <slot name="process"></slot>
    </div>

    <div
      class="description text-300"
      :class="isDisplayDescriptionUnder && 'under'"
    >
      {{ description }}
    </div>

    <div v-if="isDisplayDescriptionUnder" class="navi"></div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped></style>
