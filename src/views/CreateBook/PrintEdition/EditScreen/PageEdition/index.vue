<template>
  <div class="page-edition">
    <PageWrapper ref="pageWrapper" :ruler-size="rulerSize">
      <template #ruler-x>
        <XRuler
          :canvas-size="canvasSize"
          :page-size="printSize"
          @change="onWidthChange"
        />
      </template>

      <template #ruler-y>
        <YRuler
          :canvas-size="canvasSize"
          :page-size="printSize"
          @change="onHeightChange"
        />
      </template>

      <template #default>
        <SizeWrapper @mounted="onContainerReady" @updated="onContainerResized">
          <canvas id="canvas" ref="canvas" class="print-canvas"></canvas>
          <PrintCanvasLines
            :canvas-size="canvasSize"
            :page-size="printSize"
            :sheet-type="currentSheetType"
          />
        </SizeWrapper>
      </template>
    </PageWrapper>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
