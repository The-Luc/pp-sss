<template>
  <div :key="componentKey" class="title-content">
    <div class="project-title">{{ titleName }}</div>
    <input
      type="text"
      :disabled="disabled"
      :value="titleValue"
      placeholder="Click to add title"
      maxlength="50"
      @keydown.esc="onEsc"
      @change="onChange"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" scoped src="./style.scss" />
