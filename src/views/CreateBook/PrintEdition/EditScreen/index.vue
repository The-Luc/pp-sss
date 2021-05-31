<template lang="">
  <div class="row print-main">
    <Header name-editor="print editor" @onClickSave="onClickSavePrintCanvas" />
    <ToolBar />
    <FeedbackBar />
    <SidebarSection />
    <PageEdition />
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
