<template lang="">
  <div class="col-10 page-edition">
    <div class="container-edition">
      <div :class="['canvas-soft-cover', { 'canvas-hard-cover': isHardCover }]">
        <div class="page">
          <canvas id="page-left"></canvas>
          <canvas id="page-right"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
