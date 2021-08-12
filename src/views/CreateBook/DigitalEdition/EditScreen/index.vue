<template>
  <div class="row print-main">
    <Header
      name-editor="digital editor"
      @onClickSave="onClickSaveDigitalCanvas"
    />
    <ToolBar :is-digital-editor="true" />
    <FeedbackBar
      :is-open-menu-properties="isOpenMenuProperties"
      :selected-tool-name="selectedToolName"
      :is-digital="true"
    />
    <SidebarSection />

    <transition name="slide-x-transition">
      <PhotoSidebar
        v-show="isOpenMediaSidebar"
        :is-show-autoflow="isShowAutoflow"
        type-name="Media"
        @closePhotoSidebar="closeMediaSidebar"
        @autoflow="handleAutoflow"
        @click="openModalMedia"
      >
      </PhotoSidebar>
    </transition>

    <ScreenEdition />

    <ModalAddMedia :is-open-modal="isOpenModal" @cancel="onCancel" />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
