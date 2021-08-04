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
    <PhotoSidebar
      :is-show-autoflow="isShowAutoflow"
      @autoflow="handleAutoflow"
      @selectedImages="handleSelectedImages"
    >
      <SheetMedia v-if="isShowAutoflow" :media="sheetMedia" />
    </PhotoSidebar>
    <PageEdition />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
