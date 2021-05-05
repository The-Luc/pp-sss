<template>
  <div class="btn-help item-center pointer" @click="openModal">
    <img class="help" :src="ICON_LOCAL.HELP" alt="help" width="14" />
    <p class="text-500 text-size-xxs white--text text-center mb-0">
      Help
    </p>
    <Modal title="Need help?" showIconClose>
      Ahiiiiiiii
    </Modal>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" scoped src="./style.scss" />
