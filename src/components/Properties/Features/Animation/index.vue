<template>
  <div class="animation-container">
    <span class="properties-title" :class="{ disabled: disabled }">
      {{ title }}
    </span>

    <control
      type="playIn"
      :disabled="disabled"
      :config="playInConfig"
      :order="playInOrder"
      :apply-options="applyOptions"
      :order-options="orderOptions"
      :is-disabled-preview="isDisabledPreview"
      :is-order-disabled="isPlayInOrderDisabled"
      @preview="onPreview"
      @apply="applyPlayIn"
      @changeOrder="onPlayInOrderChange"
    ></control>

    <div class="horizontal-line"></div>

    <control
      type="playOut"
      :disabled="disabled"
      :config="playOutConfig"
      :order="playOutOrder"
      :apply-options="applyOptions"
      :order-options="orderOptions"
      :is-disabled-preview="isDisabledPreview"
      :is-order-disabled="isPlayOutOrderDisabled"
      @preview="onPreview"
      @apply="applyPlayOut"
      @changeOrder="onPlayOutOrderChange"
    ></control>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
