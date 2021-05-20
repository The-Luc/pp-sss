<template lang="">
  <div class="col-10 page-edition">
    <div class="container-edition">
      <canvas id="page-left"></canvas>
      <canvas id="page-right"></canvas>
      <div :class="['canvas-soft-cover', { 'canvas-hard-cover': isHardCover }]">
        <div class="page">
          <div class="page-left"></div>
          <div class="page-right"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
