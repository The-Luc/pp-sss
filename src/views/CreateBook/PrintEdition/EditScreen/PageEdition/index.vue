<template>
  <div class="page-edition">
    <PageWrapper
      ref="pageWrapper"
      :ruler-size="rulerSize"
      :is-scroll-x="isScroll.x"
      :is-scroll-y="isScroll.y"
    >
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

    <mapping-layout-custom-change
      v-if="isShowCustomChangesConfirm"
      @onAccept="onClickGotItCustomChange"
    >
      The Mapping Type for this spread is <strong>Layout Mapping</strong>. That
      means that only content changes made to the pre-populated image and text
      boxes will mapped to the digital edition. Custom changes, like adding a
      new image box, will NOT be reflected in the digital edition.
    </mapping-layout-custom-change>

    <mapping-layout-custom-change
      v-if="isShowMappingContentChange"
      header="Layout Mapping: Digital to Print"
      @onAccept="onClickGotItContentChange"
      >The Primary Format listed for this project is “Digital”. This means the
      mapping only goes from the digital edition to the print edition. Changes
      made to the print edition will not be reflected in the digital edition.
      <br />
      <br />
      Additionally, content changes made to image and text boxes will disable
      the mapping connection for those edited
      items.</mapping-layout-custom-change
    >
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
