<template>
  <div>
    <div v-if="!isMediaAdditionalDisplayed" class="modal-footer">
      <v-btn class="footer-btn cancel" @click="onCancel">Cancel</v-btn>
      <v-btn class="footer-btn action" :disabled="isDisabled" @click="onSelect">
        {{ btnAction }}
      </v-btn>
    </div>

    <div v-if="isMediaAdditionalDisplayed" class="modal-footer-tab-add">
      Note: Photos added here will also be added to your Private Stream
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
