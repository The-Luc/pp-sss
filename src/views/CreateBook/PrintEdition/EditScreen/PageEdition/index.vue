<template>
  <div class="page-edition">
    <PageWrapper>
      <SizeWrapper @mounted="onContainerReady" @updated="onContainerResized">
        <canvas id="canvas" ref="canvas" class="print-canvas"></canvas>
      </SizeWrapper>
    </PageWrapper>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
