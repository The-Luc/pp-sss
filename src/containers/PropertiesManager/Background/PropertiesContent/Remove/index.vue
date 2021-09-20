<template>
  <div class="remove-background">
    <v-btn
      class="remove-background-button"
      :disabled="disabled"
      @click.native="onRemove"
    >
      <v-icon>do_not_disturb</v-icon>

      <span class="text">Remove Background</span>
    </v-btn>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" scoped src="./style.scss" />
