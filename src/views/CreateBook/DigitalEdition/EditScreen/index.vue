<template lang="">
  <div class="row print-main">
    <Header
      name-editor="digital editor"
      @onClickSave="onClickSaveDigitalCanvas"
    />
    <ToolBar :is-digital-editor="true" />
    <FeedbackBar
      :is-open-menu-properties="isOpenMenuProperties"
      :selected-tool-name="selectedToolName"
    />
    <SidebarSection />
    <PageEdition />
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
