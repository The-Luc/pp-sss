<template>
  <div class="photo-container">
    <div class="photo-header">
      <p class="photo-header-title mb-0">
        Photos
      </p>
      <v-icon @click.native="onClick">close</v-icon>
    </div>

    <div class="add-photo" @click="addPhoto">
      <v-icon>add_circle_outline</v-icon>
      <div class="add-photo-title">Add New Photos</div>
    </div>
    <div v-if="showAutoflow" class="autoflow" @click="autoflow">
      <v-icon>auto_fix_high</v-icon>
      <div class="autoflow-title">Autoflow Photos</div>
    </div>

    <slot />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
