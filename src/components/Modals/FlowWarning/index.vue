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
      <i class="material-icons-outlined icon icon-close" @click="onClose">
        close
      </i>
    </div>

    <div class="content">
      <div class="descript">
        {{ descriptModal }}
      </div>
      <PpButton class="button" is-active @click.native="onClose">
        Continue
      </PpButton>
    </div>
  </v-dialog>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
