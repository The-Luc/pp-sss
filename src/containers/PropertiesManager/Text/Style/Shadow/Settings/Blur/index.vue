<template>
  <div>
    <label class="text-500 text-size-xsm">Blur:</label>
    <Slider suffix="pt" :value="value" @change="onChange" />
  </div>
</template>
<script src="./script.js" />

<style lang="scss" src="./style.scss" />
