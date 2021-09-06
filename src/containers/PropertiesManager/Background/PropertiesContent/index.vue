<template>
  <div class="background-prop-content" :class="disabled && 'disabled'">
    <Opacity :value="opacity" :disabled="disabled" @change="onChangeOpacity" />

    <div class="group-container">
      <Flip :disabled="disabled" />

      <v-divider vertical class="item-vertical"></v-divider>

      <Remove :disabled="disabled" @click="onClickRemove" />
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
