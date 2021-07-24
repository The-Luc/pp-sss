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
    <ScreenEdition />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
