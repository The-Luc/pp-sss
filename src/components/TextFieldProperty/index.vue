<template>
  <div class="text-field-property">
    <div class="item-container">
      <div class="item-input">
        <input :value="value" type="text" @change="change()" />
        <div class="input-label">{{ label }}</div>
      </div>
      <div class="item-title">{{ title }}</div>
    </div>
  </div>
</template>
<script src="./script.js" />

<style lang="scss" src="./style.scss" />
