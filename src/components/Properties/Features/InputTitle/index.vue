<template>
  <div :key="componentKey" class="title-content">
    <div class="project-title">{{ titleName }}</div>
    <div :class="{ disabled: disabled }">
      <input
        type="text"
        :disabled="disabled"
        :value="titleValue"
        placeholder="Click to add title"
        :maxlength="maxlength"
        @keydown.esc="onEsc"
        @change="onChange"
      />
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" scoped src="./style.scss" />
