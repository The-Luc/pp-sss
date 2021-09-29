<template>
  <div id="reflow-portrait">
    <common-modal
      title="Reflow Portraits?"
      width="466"
      container="#reflow-portrait"
      :is-open-modal="isOpenModal"
      :is-theme-used="true"
      :can-close-outside="true"
      :is-footer-displayed="false"
      :is-close-icon-displayed="false"
    >
      <div class="reflow-portrait-message">
        The following portrait folder(s) have already been flowed.
        <br />
        If you would like to reflow, click proceed.
      </div>

      <div class="reflow-portrait-folder">
        <div
          v-for="folder in flowedFolders"
          :key="folder.id"
          class="reflow-portrait-folder-name"
        >
          {{ folder.name }}
        </div>
      </div>

      <div class="reflow-portrait-footer">
        <pp-button class="pp-btn-proceed" is-active @click="onApply">
          Proceed
        </pp-button>
        <pp-button class="pp-btn-cancel" @click="onCancel">
          Cancel
        </pp-button>
      </div>
    </common-modal>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
