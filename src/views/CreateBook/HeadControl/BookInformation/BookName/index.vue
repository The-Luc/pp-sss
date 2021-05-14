<template>
  <div class="book-name-control">
    <v-text-field
      ref="nameInput"
      v-model="albumName"
      counter="10"
      maxlength="50"
      @blur="onSubmit"
      @keyup.enter="onEnter"
      @keydown.esc="onCancel"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
