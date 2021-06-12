<template>
  <div>
    <label class="text-500 text-size-xsm">Offset:</label>
    <Slider suffix="pt" :value="value" @change="onChange" />
  </div>
</template>
<script src="./script.js" />

<style lang="scss" src="./style.scss" />
