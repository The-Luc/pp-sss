<template>
  <!-- <v-dialog
    id="portrait-folder"
    v-model="isOpenModal"
    content-class="portrait-folder"
    persistent
    max-width="796"
  >
    <Header title="Select Portait Folders" @onCloseModal="onCancel" />
    <div class="content-portrait-folder">portrait folder</div>
    <Footer
      class="footer-portrait-folder"
      @select="onSelect"
      @cancel="onCancel"
    />
  </v-dialog> -->

  <div id="portrait-folder">
    <CommonModal
      title="Select Portait Folders"
      accept-text="Select"
      container="#portrait-folder"
      width="796"
      :is-open-modal="isOpenModal"
      @cancel="onCancel"
      @accept="onSelect"
    >
      <div class="content-portrait-folder">portrait folder</div>
    </CommonModal>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
