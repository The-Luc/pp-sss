<template>
  <Modal
    class="modal-theme"
    title="Yearbook Theme"
    width="800"
    :theme-modal="true"
  >
    <div class="modal-theme-body">
      <Themes
        v-if="!themePreview"
        :themes="themes"
        :selected-theme-id="selectedThemeId"
        @onSelectTheme="onSelectTheme($event)"
        @onPreviewTheme="onPreviewTheme($event)"
      />
      <Preview v-if="themePreview" />
    </div>
    <div class="modal-theme-footer">
      <PpButton class="button-select" is-active @click.native="onSubmitThemeId">
        Select
      </PpButton>
    </div>
  </Modal>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
