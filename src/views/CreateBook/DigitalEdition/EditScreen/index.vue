<template>
  <div class="row digital-main">
    <Header
      name-editor="digital editor"
      @onClickSave="onClickSaveDigitalCanvas"
    />

    <ToolBar
      @undo="onUndo"
      @redo="onRedo"
      @switchTool="onToolSwitch"
      @endInstruction="onInstructionEnd"
    />

    <FeedbackBar
      :is-open-menu-properties="isOpenMenuProperties"
      :selected-tool-name="selectedToolName"
      :is-digital="true"
      @zoom="onZoom"
    />

    <div class="left-panel">
      <SidebarSection />

      <transition name="slide-x-transition">
        <PhotoSidebar
          v-show="isMediaSidebarOpen"
          media-type="Media"
          :is-show-autoflow="isShowAutoflow"
          :disabled-autoflow="disabledAutoflow"
          :is-media-sidebar-open="isMediaSidebarOpen"
          :media="sheetMedia"
          @remove="onRemovePhoto"
          @drag="onDrag"
          @closePhotoSidebar="closeMediaSidebar"
          @autoflow="handleAutoflow"
          @click="openModalMedia"
        />
      </transition>
    </div>

    <ScreenEdition
      ref="canvasEditor"
      @drop="onDrop"
      @openCropControl="openCropControl"
    />

    <MediaModal
      type="media"
      :is-open-modal="isOpenModal"
      @select="handleSelectedMedia"
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

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
