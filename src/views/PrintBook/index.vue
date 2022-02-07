<template>
  <div id="snapshot-view" class="pdf-container" :style="containerCssStyle">
    <div
      ref="canvas-container"
      class="canvas-container"
      :style="containerCssStyle"
    >
      <canvas
        id="canvas"
        ref="canvas"
        class="page-canvas"
        :style="canvasCssStyle"
      ></canvas>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
