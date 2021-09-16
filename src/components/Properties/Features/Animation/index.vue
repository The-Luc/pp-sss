<template>
  <div class="animation-container">
    <span class="properties-title">{{ title }}</span>
    <Control
      type="playIn"
      :config="playInConfig"
      :is-disabled-preview="isDisabledPreview"
      @preview="onPreview"
      @apply="applyPlayIn"
    />
    <div class="horizontal-line"></div>
    <Control
      type="playOut"
      :config="playOutConfig"
      :is-disabled-preview="isDisabledPreview"
      @preview="onPreview"
      @apply="applyPlayOut"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
