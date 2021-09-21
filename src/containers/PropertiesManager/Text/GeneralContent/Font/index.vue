<template>
  <div class="font-container">
    <div class="col-7">
      <font-family
        :selected-font="selectedFont"
        @change="onChange"
      ></font-family>
    </div>
    <div class="col-4">
      <font-size :selected-size="selectedSize" @change="onChange"></font-size>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" scoped src="./style.scss" />
