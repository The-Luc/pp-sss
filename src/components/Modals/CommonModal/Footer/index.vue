<template>
  <div class="pp-modal-footer">
    <v-btn v-if="isCancelButtonDisplayed" class="btn cancel" @click="onCancel">
      {{ cancelText }}
    </v-btn>

    <v-btn
      class="btn accept"
      :disabled="isAcceptButtonDisabled"
      @click="onAccept"
    >
      {{ acceptText }}
    </v-btn>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
