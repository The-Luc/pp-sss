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
        v-show="isOpenPhotoSidebar"
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

    <PageEdition ref="canvasEditor" @drop="onDrop" />

    <ModalAddPhotos
      type="photos"
      :is-open-modal="isOpenModal"
      @select="handleSelectedImages"
      @cancel="onCancel"
      @uploadImages="onUploadImages"
    />
    <ModalAddMedia
      v-if="isOpenModalAddMedia"
      :files="files"
      :is-open-modal="isOpenModalAddMedia"
      @cancel="onCancelAddMedia"
    />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
