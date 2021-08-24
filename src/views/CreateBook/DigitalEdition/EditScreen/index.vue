<template>
  <div class="row print-main">
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

    <SidebarSection />

    <transition name="slide-x-transition">
      <PhotoSidebar
        v-show="isMediaSidebarOpen"
        media-type="Media"
        :is-show-autoflow="isShowAutoflow"
        :disabled-autoflow="disabledAutoflow"
        @closePhotoSidebar="closeMediaSidebar"
        @autoflow="handleAutoflow"
        @click="openModalMedia"
      >
        <SheetMedia
          v-if="isShowAutoflow"
          :media="sheetMedia"
          :is-media-sidebar-open="isMediaSidebarOpen"
          @remove="onRemovePhoto"
          @drag="onDrag"
        />
      </PhotoSidebar>
    </transition>

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
