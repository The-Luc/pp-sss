<template>
  <div class="title">
    <div class="title-content">
      <div v-if="!isLink" class="project-title">{{ titleName }}</div>
      <div v-else class="project-title">Left hand page title:</div>
      <input
        type="text"
        :disabled="isDisable"
        :value="titleValueLeft"
        placeholder="Click to add title"
      />
    </div>
    <div v-if="isLink" class="title-content">
      <div class="project-title">Right hand page title:</div>
      <input
        type="text"
        :disabled="isDisable"
        :value="titleValueRight"
        placeholder="Click to add title"
      />
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" s src="./style.scss" />
