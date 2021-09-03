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

    <FeedbackBar @zoom="onZoom" />

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
      v-if="modalDisplay.portaitFlow"
      container="#editor"
      :is-open="modalDisplay.portaitFlow"
      :selected-folders="selectedFolders"
      @cancel="onClosePortrait"
      @accept="onApplyPortrait"
    />

    <PortraitFolder
      v-if="modalDisplay[toolNames.PORTRAIT]"
      :is-open-modal="modalDisplay[toolNames.PORTRAIT]"
      @cancel="onClosePortrait"
      @select="onSelectPortraitFolders"
    />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
