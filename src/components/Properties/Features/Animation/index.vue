<template>
  <div class="animation-container">
    <span class="properties-title">{{ title }}</span>
    <Control
      type="playIn"
      :config="playInConfig"
      :order="playInOrder"
      :is-disabled-preview="isDisabledPreview"
      :object-type="objectType"
      @preview="onPreview"
      @apply="applyPlayIn"
      @changeOrder="onPlayInOrderChange"
    />
    <div class="horizontal-line"></div>
    <Control
      type="playOut"
      :config="playOutConfig"
      :order="playOutOrder"
      :is-disabled-preview="isDisabledPreview"
      :object-type="objectType"
      @preview="onPreview"
      @apply="applyPlayOut"
      @changeOrder="onPlayOutOrderChange"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
