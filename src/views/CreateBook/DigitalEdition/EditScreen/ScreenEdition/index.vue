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
    <div class="digital-frame">
      <div class="row">
        <div class="container-digital-frame">
          <div class="item-digital-frame active"></div>
          <div class="name-frame">Frame 10</div>
        </div>
        <div class="container-digital-frame">
          <div class="item-digital-frame add-frame">
            <div class="add-digital-frame">
              <v-icon>add_circle_outline</v-icon>
              Add Frame
            </div>
          </div>
        </div>
      </div>
    </div>
    <AddBoxInstruction v-if="visible" :element="element" :x="x" :y="y" />
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
