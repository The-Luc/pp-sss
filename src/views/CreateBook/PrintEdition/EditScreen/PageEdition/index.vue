<template>
  <div class="page-edition">
    <PageSizeWrapper @mounted="onContainerReady" @updated="onContainerResized">
      <canvas id="canvas" ref="canvas" class="printCanvas"></canvas>
    </PageSizeWrapper>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
