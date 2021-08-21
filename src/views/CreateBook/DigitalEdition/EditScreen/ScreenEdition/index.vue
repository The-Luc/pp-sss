<template>
  <div class="screen-edition">
    <div class="digital-canvas-container">
      <SizeWrapper @mounted="onContainerReady" @updated="onContainerResized">
        <canvas
          id="digitalCanvas"
          ref="digitalCanvas"
          class="digital-canvas"
        ></canvas>
      </SizeWrapper>
    </div>

    <Frames
      :frames="frames"
      :active-frame-id="currentFrameId"
      :show-add-frame="showAddFrame"
    />
    <AddBoxInstruction v-if="visible" :element="element" :x="x" :y="y" />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
