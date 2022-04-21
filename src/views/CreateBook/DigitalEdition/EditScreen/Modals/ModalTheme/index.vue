<template>
  <Modal
    class="modal-theme"
    title="Digital Yearbook Theme"
    width="786"
    :is-close-out-side="false"
    :theme-modal="true"
  >
    <div class="modal-theme-body">
      <Themes
        v-if="!isPreviewing"
        :themes="themes"
        :selected-theme-id="selectedThemeId"
        @onSelectTheme="onSelectTheme($event)"
        @onPreviewTheme="onPreviewTheme($event)"
      />
      <Preview
        v-if="isPreviewing"
        :theme-name="themeNamePreview"
        :layouts="layoutsOfThemePreview"
        @onClosePreview="onClosePreview"
      />
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
