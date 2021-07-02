<template>
  <div
    class="eye-dropper"
    :style="{
      transform: `translate(${x + 5}px, ${y - 45}px)`,
      backgroundColor: color
    }"
  />
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
