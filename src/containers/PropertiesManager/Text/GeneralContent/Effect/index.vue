<template>
  <div class="effect-container">
    <Color :color="color" @change="onChangeColor" />
    <Presentation :selected-styles="selectedStyles" @change="onChange" />
    <TextCase :selected-case="selectedCase" @change="onChange" />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
