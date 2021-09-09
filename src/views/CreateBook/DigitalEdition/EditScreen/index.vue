<template>
  <div class="row digital-main">
    <Header
      name-editor="digital editor"
      @onClickSave="onClickSaveDigitalCanvas"
    />

    <ToolBar
      :disabled-items="disabledItems"
      @undo="onUndo"
      @redo="onRedo"
      @switchTool="onToolSwitch"
      @endInstruction="onInstructionEnd"
      @toggleModal="onToggleModal"
    />

    <FeedbackBar :is-digital="true" @zoom="onZoom" />

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
      :frames="frames"
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

    <portrait-folder
      v-if="modal[toolNames.PORTRAIT].isOpen"
      :is-open-modal="modal[toolNames.PORTRAIT].isOpen"
      @cancel="onClosePortrait"
      @select="onSelectPortraitFolders"
    ></portrait-folder>

    <the-preview-modal
      v-if="modal[modalType.TRANSITION_PREVIEW].isOpen"
      :transition="modal[modalType.TRANSITION_PREVIEW].data.transition"
      :direction="modal[modalType.TRANSITION_PREVIEW].data.direction"
      :duration="modal[modalType.TRANSITION_PREVIEW].data.duration"
      :first-image-url="modal[modalType.TRANSITION_PREVIEW].data.previewUrl1"
      :second-image-url="modal[modalType.TRANSITION_PREVIEW].data.previewUrl2"
      @close="onToggleModal(modalType.TRANSITION_PREVIEW)"
    ></the-preview-modal>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
