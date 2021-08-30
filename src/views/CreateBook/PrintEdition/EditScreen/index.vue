<template>
  <div id="editor" class="row print-main">
    <Header name-editor="print editor" @onClickSave="onClickSavePrintCanvas" />

    <ToolBar
      @undo="onUndo"
      @redo="onRedo"
      @switchTool="onToolSwitch"
      @endInstruction="onInstructionEnd"
      @toggleModal="onToggleModal"
    />

    <FeedbackBar
      :is-open-menu-properties="isOpenMenuProperties"
      :selected-tool-name="selectedToolName"
      @zoom="onZoom"
    />

    <div class="left-panel">
      <SidebarSection />

      <transition name="slide-x-transition">
        <PhotoSidebar
          v-show="isMediaSidebarOpen"
          media-type="Photos"
          :is-show-autoflow="isShowAutoflow"
          :disabled-autoflow="disabledAutoflow"
          :is-media-sidebar-open="isMediaSidebarOpen"
          :media="sheetMedia"
          @autoflow="handleAutoflow"
          @closePhotoSidebar="closePhotoSidebar"
          @click="openModalPhotos"
          @remove="onRemovePhoto"
          @drag="onDrag"
        />
      </transition>
    </div>

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

    <PortraiFlow
      v-if="modalDisplay[toolNames.PORTRAIT]"
      container="#editor"
      :is-open="modalDisplay[toolNames.PORTRAIT]"
      @cancel="onClosePortrait"
      @accept="onApplyPortrait"
    />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
