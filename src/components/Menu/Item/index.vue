<template>
  <div class="menu-item mb-2">
    <label class="text-300 text-size-sm text-line-14">{{ title }}:</label>
    <div class="d-flex mb-3 align-center" @click="onItemClick">
      <img :src="arrowDown" class="arrow-down" />
      <span class="text-500 text-size-md d-block">{{ value }}</span>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
