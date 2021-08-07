<template>
  <div class="row print-main">
    <Header name-editor="print editor" @onClickSave="onClickSavePrintCanvas" />
    <ToolBar />
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
        @selectedImages="handleSelectedImages"
      >
        <SheetMedia
          v-if="isShowAutoflow"
          :media="sheetMedia"
          @remove="onRemovePhoto"
          @drag="onDrag"
        />
      </PhotoSidebar>
    </transition>

    <PageEdition @drop="onDrop" />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
