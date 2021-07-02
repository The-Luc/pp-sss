<template>
  <div class="page-edition">
    <PageWrapper>
      <template #ruler-x>
        <XRuler :canvas-size="canvasSize" :page-size="printSize" />
      </template>

      <template #ruler-y>
        <YRuler :canvas-size="canvasSize" :page-size="printSize" />
      </template>

      <template #default>
        <SizeWrapper @mounted="onContainerReady" @updated="onContainerResized">
          <canvas id="canvas" ref="canvas" class="print-canvas"></canvas>
          <PrintCanvasLines
            :canvas-size="canvasSize"
            :page-size="printSize"
            :sheet-type="currentSheetType"
          />
          <div
            v-show="awaitPickColor"
            class="eye-dropper-overlay"
            :style="{
              cursor: `url(${eyeDropperIcon}) 12 12, auto`
            }"
            @click="onEyeDropperOverlayClick"
          />
        </SizeWrapper>
      </template>
    </PageWrapper>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
