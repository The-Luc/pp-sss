<template lang="">
  <div class="col-12 print-editor">
    <div class="row print-editor-header">
      <v-overlay :value="overlay" color="transparent"></v-overlay>
      <PpButton type="btn" class="btn-save" @click="onClickSave">
        SAVE & EXIT
      </PpButton>
      <div v-if="message" :key="componentKey" class="auto-save__container">
        <div class="auto-save__content">
          <div class="auto-save__text autosave-text">{{ message }}</div>
          <div class="auto-save__bar"></div>
        </div>
        <div class="auto-save__text saved-text autosave__content">Saved</div>
      </div>
      <span>{{ nameEditor }}</span>
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" />
