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

    <!-- CUSTOM CHANGE MODAL -->
    <mapping-layout-custom-change
      v-if="isShowCustomChangesConfirm"
      @onAccept="onClickGotItCustomChange"
    >
      The Mapping Type for this screen is <strong>Layout Mapping</strong>. That
      means that only content changes made to the pre-populated image and text
      boxes will mapped to the print edition. Custom changes, like adding a new
      image box, will NOT be reflected in the print edition.
    </mapping-layout-custom-change>

    <!-- LAYOUT MAPPING: CONTENT CHANGE MODAL -->
    <mapping-layout-custom-change
      v-if="isShowMappingContentChange"
      header="Layout Mapping: Print to Digital"
      @onAccept="onClickGotItContentChange"
    >
      The Primary Format listed for this project is “Print”. This means the
      mapping only goes from the print edition to the digital edition. Changes
      made to the digital edition will not be reflected in the print edition.
      <br />
      <br />
      Additionally, content changes made to image and text boxes will disable
      the mapping connection for those edited items.
    </mapping-layout-custom-change>

    <!-- CUSTOM MAPPING MODAL -->
    <mapping-layout-custom-change
      v-if="isShowCustomMappingModal"
      header="Custom Mapping: Print to Digital"
      @onAccept="onClickGotItCustomMappingModal"
    >
      The Primary Format listed for this project is “Print”. This means the
      mapping only goes from the print edition to the digital edition. Changes
      made to the digital edition will not be reflected in the print edition.
      <br />
      <br />
      Additionally, any changes made to shapes, clip art, media and/or text
      elements will disable the mapping connection for those items.
    </mapping-layout-custom-change>

    <!-- ADDING VIDEO TO PRIMARY FORAMT MODAL -->
    <mapping-layout-custom-change
      v-if="isShowMappingVideoContentChange"
      header="Video Mapping"
      @onAccept="onClickGotItVideoContentChange"
    >
      A video has been placed in a mapped image box. As a result, the connection
      between this image box and the corresponding image box on the print side
      has been disabled. Any edits or changes made to these image boxes moving
      forward will only be reflected in the edition where the are made.
    </mapping-layout-custom-change>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
