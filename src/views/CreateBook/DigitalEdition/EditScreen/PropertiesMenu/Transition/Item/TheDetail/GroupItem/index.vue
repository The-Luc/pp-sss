<template>
  <div class="group-item">
    <div v-if="isNameDisplayed" class="label" :class="{ disabled: disabled }">
      {{ name }}
    </div>

    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
