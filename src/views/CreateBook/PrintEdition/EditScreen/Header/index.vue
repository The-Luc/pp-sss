<template lang="">
  <div class="col-12 print-editor">
    <div class="row print-editor-header">
      <PpButton type="btn" class="btn-save" @click="onChangeView(screen.PRINT)">
        SAVE & EXIT
      </PpButton>
      <span>{{ nameEditor }}</span>
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" />
