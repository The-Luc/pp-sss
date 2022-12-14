<template>
  <div class="row digital-main">
    <editor-header
      name-editor="digital editor"
      @onClickSave="onClickSaveDigitalCanvas"
    ></editor-header>

    <tool-bar
      :disabled-items="disabledItems"
      @undo="onUndo"
      @redo="onRedo"
      @switchTool="onToolSwitch"
      @endInstruction="onInstructionEnd"
      @toggleModal="onToggleModal"
    ></tool-bar>

    <feedback-bar :is-digital="true" @zoom="onZoom"></feedback-bar>

    <div class="left-panel">
      <sidebar-section></sidebar-section>

      <transition name="slide-x-transition">
        <photo-sidebar
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
        ></photo-sidebar>
      </transition>
    </div>

    <screen-edition
      ref="canvasEditor"
      :frames="frames"
      @drop="onDrop"
      @openCropControl="openCropControl"
    ></screen-edition>

    <media-modal
      type="media"
      :is-open-modal="isOpenModal"
      @select="handleSelectedMedia"
      @cancel="onCancel"
    ></media-modal>

    <crop-control
      :open="isOpenCropControl"
      :selected-image="selectedImage"
      @crop="onCrop"
      @cancel="onCancel"
    ></crop-control>

    <portrait-folder
      v-if="modal[toolNames.PORTRAIT].isOpen"
      :is-open-modal="modal[toolNames.PORTRAIT].isOpen"
      :is-digital="true"
      @cancel="onClosePortrait"
      @select="onSelectPortraitFolders"
    ></portrait-folder>

    <portrait-flow
      v-if="modal[modalType.PORTRAIT_FLOW].isOpen"
      container="#editor"
      :selected-folders="modal[modalType.PORTRAIT_FLOW].data.folders"
      :is-load-mapping="isShowMappingWelcome"
      @cancel="onClosePortrait"
      @accept="onApplyPortrait"
    ></portrait-flow>

    <transition-preview
      v-if="modal[modalType.TRANSITION_PREVIEW].isOpen"
      :transition="modal[modalType.TRANSITION_PREVIEW].data.transition"
      :direction="modal[modalType.TRANSITION_PREVIEW].data.direction"
      :duration="modal[modalType.TRANSITION_PREVIEW].data.duration"
      :first-image-url="modal[modalType.TRANSITION_PREVIEW].data.previewUrl1"
      :second-image-url="modal[modalType.TRANSITION_PREVIEW].data.previewUrl2"
      @close="onToggleModal(modalType.TRANSITION_PREVIEW)"
    ></transition-preview>

    <playback
      v-if="modal[modalType.PLAYBACK].isOpen"
      :playback-data="modal[modalType.PLAYBACK].data.playbackData"
      @close="onToggleModal(modalType.PLAYBACK)"
    ></playback>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
