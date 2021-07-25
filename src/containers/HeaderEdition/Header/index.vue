<template lang="">
  <div class="col-12 print-editor">
    <div class="row print-editor-header">
      <PpButton type="btn" class="btn-save" @click="onClickSave">
        SAVE & EXIT
      </PpButton>
      <div class="auto-save__container">
        <div class="auto-save__text">Autosaving...</div>
        <!-- <div class="auto-save-text">{{ triggerAutosave }}</div> -->
        <div class="auto-save__bar"></div>
      </div>
      <span>{{ nameEditor }}</span>
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" />
