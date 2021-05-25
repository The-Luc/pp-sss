<template lang="">
  <div class="row print-main">
    <Header name-editor="digital editor" />
    <ToolBar :is-digital-editor="true" />
    <FeedbackBar />
    <SidebarSection />
    <PageEdition />
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
