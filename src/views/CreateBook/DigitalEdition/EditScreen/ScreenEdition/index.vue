<template>
  <div class="screen-edition">
    <div class="row digital-canvas-container">
      <SizeWrapper @mounted="onContainerReady" @updated="onContainerResized">
        <canvas
          id="digitalCanvas"
          ref="digitalCanvas"
          class="digital-canvas"
        ></canvas>
      </SizeWrapper>
    </div>

    <Frames
      :frames="frameList"
      :active-frame-id="currentFrameId"
      @addFrame="onAddFrame"
      @onFrameClick="onFrameClick"
    />
    <AddBoxInstruction v-if="visible" :element="element" :x="x" :y="y" />
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
