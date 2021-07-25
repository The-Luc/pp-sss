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
    <PageEdition />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
