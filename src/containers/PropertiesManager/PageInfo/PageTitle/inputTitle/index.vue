<template>
  <div class="title-content">
    <div class="project-title">{{ titleName }}</div>
    <input
      type="text"
      :disabled="isDisabled"
      :value="titleValue"
      placeholder="Click to add title"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" s src="./style.scss" />
