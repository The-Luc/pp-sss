<template>
  <div class="row print-main">
    <Header
      name-editor="digital editor"
      @onClickSave="onClickSaveDigitalCanvas"
    />

    <ToolBar
      :is-digital-editor="true"
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
        v-show="isOpenMediaSidebar"
        media-type="Media"
        :is-show-autoflow="isShowAutoflow"
        @closePhotoSidebar="closeMediaSidebar"
        @autoflow="handleAutoflow"
        @click="openModalMedia"
      >
        <SheetMedia
          :media="sheetMedia"
          @remove="onRemovePhoto"
          @drag="onDrag"
        />
      </PhotoSidebar>
    </transition>

    <ScreenEdition ref="canvasEditor" @drop="onDrop" />

    <ModalAddMedia
      :is-open-modal="isOpenModal"
      @select="handleSelectedMedia"
      @cancel="onCancel"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
