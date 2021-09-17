<template>
  <div class="background-prop-content">
    <opacity :value="opacity" :disabled="disabled" @change="onChangeOpacity" />

    <div class="group-container">
      <flip :disabled="disabled" />

      <v-divider vertical class="item-vertical"></v-divider>

      <remove-button
        :disabled="disabled"
        @click="onClickRemove"
      ></remove-button>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
