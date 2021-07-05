<template>
  <div
    class="eye-dropper"
    :style="{
      transform: `translate(${x}px, ${y}px)`
    }"
  >
    <div
      class="review-color"
      :style="{
        backgroundColor: color
      }"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
