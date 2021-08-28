<template lang="">
  <div class="col-12 editor">
    <div class="row editor-header">
      <v-overlay :value="overlay" color="transparent"></v-overlay>
      <PpButton type="btn" class="btn-save" @click="onClickSave">
        SAVE & EXIT
      </PpButton>
      <SavingIndicator :status="savingStatus" :message="message" />
      <span>{{ nameEditor }}</span>
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" />
