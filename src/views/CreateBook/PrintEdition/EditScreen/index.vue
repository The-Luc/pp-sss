<template>
  <div class="row print-main">
    <Header name-editor="print editor" @onClickSave="onClickSavePrintCanvas" />
    <ToolBar @undo="onUndo" @redo="onRedo" />
    <FeedbackBar
      :is-open-menu-properties="isOpenMenuProperties"
      :selected-tool-name="selectedToolName"
      @zoom="onZoom"
    />
    <SidebarSection />

    <transition name="slide-x-transition">
      <PhotoSidebar
        v-show="isOpenPhotoSidebar"
        :is-show-autoflow="isShowAutoflow"
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
