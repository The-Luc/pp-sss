<template>
  <div class="got-it-container">
    <p class="got-it-title text-left">{{ title }}</p>
    <p class="got-it-content text-left">
      {{ message }}
    </p>
    <p class="got-it-action">
      <span class="got-it-text" @click="onClick">
        Got it
      </span>
    </p>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
