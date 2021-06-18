<template>
  <div class="page-edition">
    <PageWrapper>
      <SizeWrapper @mounted="onContainerReady" @updated="onContainerResized">
        <canvas id="canvas" ref="canvas" class="print-canvas"></canvas>
        <PrintCanvasLines
          :canvas-size="canvasSize"
          :page-size="printSize"
          :sheet-type="currentSheetType"
        />
      </SizeWrapper>
    </PageWrapper>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
