<template>
  <div class="row print-main">
    <Header name-editor="print editor" @onClickSave="onClickSavePrintCanvas" />

    <ToolBar
      @undo="onUndo"
      @redo="onRedo"
      @switchTool="onToolSwitch"
      @endInstruction="onInstructionEnd"
    />

    <FeedbackBar
      :is-open-menu-properties="isOpenMenuProperties"
      :selected-tool-name="selectedToolName"
      @zoom="onZoom"
    />
    <SidebarSection />

    <transition name="slide-x-transition">
      <PhotoSidebar
        v-show="isMediaSidebarOpen"
        media-type="Photos"
        :is-show-autoflow="isShowAutoflow"
        :disabled-autoflow="disabledAutoflow"
        @closePhotoSidebar="closePhotoSidebar"
        @autoflow="handleAutoflow"
        @click="openModalPhotos"
      >
        <SheetMedia
          v-if="isShowAutoflow"
          :media="sheetMedia"
          @remove="onRemovePhoto"
          @drag="onDrag"
        />
      </PhotoSidebar>
    </transition>

    <PageEdition
      ref="canvasEditor"
      @drop="onDrop"
      @openCropControl="openCropControl"
    />

    <MediaModal
      type="photos"
      :is-open-modal="isOpenMediaModal"
      @select="handleSelectedImages"
      @cancel="onCancel"
    />

    <CropControl
      :open="isOpenCropControl"
      :selected-image="selectedImage"
      @crop="onCrop"
      @cancel="onCancel"
    />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
