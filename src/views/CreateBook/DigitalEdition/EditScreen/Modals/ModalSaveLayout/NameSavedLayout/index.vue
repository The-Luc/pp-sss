<template>
  <div class="modal-choosing-name">
    <div class="container-input">
      <div class="input-title">Add a name for your layout:</div>
      <div class="input">
        <input v-model="layoutName" type="text" maxlength="50" />
      </div>
    </div>
    <div class="container-btn">
      <PpButton is-active class="btn-first" @click="saveLayout">
        Save Layout
      </PpButton>
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
