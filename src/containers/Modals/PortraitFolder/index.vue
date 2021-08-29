<template>
  <div id="portrait-folder">
    <CommonModal
      title="Select Portait Folders"
      accept-text="Select"
      container="#portrait-folder"
      width="796"
      :is-open-modal="isOpenModal"
      :is-disable-accept="false"
      @cancel="onCancel"
      @accept="onSelect"
    >
      <div class="content-portrait-folder">portrait folder</div>
    </CommonModal>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
