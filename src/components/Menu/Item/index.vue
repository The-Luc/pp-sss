<template>
  <div
    class="menu-item"
    :class="{ 'mb-2': !isLastItem, 'last-item': isLastItem }"
  >
    <label class="text-300 text-size-sm text-line-14">{{ title }}:</label>
    <div class="d-flex align-center pointer mb-3" @click="onItemClick">
      <img :src="arrowDown" class="arrow-down" alt="arrow-down" />
      <span class="text-500 text-size-md d-block">{{ value }}</span>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
