<template>
  <v-dialog
    id="flow-warning"
    v-model="isOpenModal"
    content-class="flow-warning"
    persistent
    max-width="560"
  >
    <div class="header">
      <span>Warning</span>
      <i
        v-if="!isShowFisrtTime"
        class="material-icons-outlined icon icon-close"
        @click="onContinue"
      >
        close
      </i>
    </div>

    <div class="content">
      <div class="descript">
        {{ descriptModal }}
      </div>
      <pp-button class="button" is-active @click.native="onContinue">
        {{ isShowFisrtTime ? 'Continue, I’ll Reconfigure' : 'Continue' }}
      </pp-button>
      <pp-button
        v-if="isShowFisrtTime"
        class="button-cancel"
        is-active
        @click.native="onCancel"
      >
        Cancel
      </pp-button>
    </div>
  </v-dialog>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
