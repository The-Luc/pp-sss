<template>
  <div class="animation-container">
    <span class="properties-title">{{ title }}</span>
    <Control type="playIn" @preview="onPreview" />
    <div class="horizontal-line"></div>
    <Control type="playOut" @preview="onPreview" />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
