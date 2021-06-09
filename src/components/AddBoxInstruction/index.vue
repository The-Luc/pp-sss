<template>
  <div class="add-box-instruction" :style="{ transform: `translate(${x}px, ${y}px)`}">
    <div class="add-box-content">
      <p class="add-box-content-message">
        Click and drag to add a {{element}}
      </p>
      <div class="small-box box-top-left">&nbsp;</div>
      <div class="small-box box-top-center">&nbsp;</div>
      <div class="small-box box-top-right">&nbsp;</div>
      <div class="small-box box-middle-left">&nbsp;</div>
      <div class="small-box box-middle-right">&nbsp;</div>
      <div class="small-box box-bottom-left">&nbsp;</div>
      <div class="small-box box-bottom-center">&nbsp;</div>
      <div class="small-box box-bottom-right">&nbsp;</div>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" scoped src="./style.scss"></style>
