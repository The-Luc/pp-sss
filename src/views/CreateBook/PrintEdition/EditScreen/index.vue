<template>
  <div id="editor" class="row print-main">
    <editor-header
      name-editor="print editor"
      @onClickSave="onClickSavePrintCanvas"
    ></editor-header>

    <tool-bar
      :disabled-items="disabledItems"
      @undo="onUndo"
      @redo="onRedo"
      @switchTool="onToolSwitch"
      @endInstruction="onInstructionEnd"
      @toggleModal="onToggleModal"
    ></tool-bar>

    <feedback-bar @zoom="onZoom"></feedback-bar>

    <div class="left-panel">
      <sidebar-section></sidebar-section>

      <transition name="slide-x-transition">
        <photo-sidebar
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
        ></photo-sidebar>
      </transition>
    </div>

    <page-edition
      ref="canvasEditor"
      @drop="onDrop"
      @openCropControl="openCropControl"
    ></page-edition>

    <media-modal
      type="photos"
      :is-open-modal="isOpenMediaModal"
      @select="handleSelectedImages"
      @cancel="onCancel"
    ></media-modal>

    <crop-control
      :open="isOpenCropControl"
      :selected-image="selectedImage"
      @crop="onCrop"
      @cancel="onCancel"
    ></crop-control>

    <portrait-flow
      v-if="modalDisplay.portaitFlow"
      container="#editor"
      :selected-folders="selectedFolders"
      @cancel="onClosePortrait"
      @accept="onApplyPortrait"
    ></portrait-flow>

    <portrait-folder
      v-if="modalDisplay[toolNames.PORTRAIT]"
      :is-open-modal="modalDisplay[toolNames.PORTRAIT]"
      @cancel="onClosePortrait"
      @select="onSelectPortraitFolders"
    ></portrait-folder>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
