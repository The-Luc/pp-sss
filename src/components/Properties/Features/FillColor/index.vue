<template>
  <div class="fill-color-container">
    <color-picker
      label="Fill Color"
      :color="value"
      @change="onChange"
    ></color-picker>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
