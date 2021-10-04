<template>
  <div class="virtual">
    <div class="canvas-wrapper thumb" :style="{ transition: transitionCss }">
      <canvas ref="playbackCanvas1" class="playback-canvas"></canvas>
    </div>

    <div
      class="canvas-wrapper thumb preparation"
      :style="{ transition: transitionCss }"
    >
      <canvas ref="playbackCanvas2" class="playback-canvas"></canvas>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
