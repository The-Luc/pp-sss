<template>
  <div class="screen-edition">
    <div
      class="digital-canvas-container"
      :class="{ 'scroll-x': isScroll.x, 'scroll-y': isScroll.y }"
    >
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
      :show-add-frame="true"
    />
    <AddBoxInstruction v-if="visible" :element="element" :x="x" :y="y" />

    <mapping-layout-custom-change
      v-if="isShowCustomChangesConfirm"
      @onAccept="onClickGotItCustomChange"
    >
      The Mapping Type for this screen is <strong>Layout Mapping</strong>. That
      means that only content changes made to the pre-populated image and text
      boxes will mapped to the print edition. Custom changes, like adding a new
      image box, will NOT be reflected in the print edition.
    </mapping-layout-custom-change>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
