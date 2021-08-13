<template>
  <div class="photo-container">
    <div class="photo-header">
      <p class="photo-header-title mb-0">
        {{ mediaType }}
      </p>
      <v-icon @click.native="onClick">close</v-icon>
    </div>

    <div class="photo-btn add-photo" @click="addPhoto">
      <v-icon>add_circle_outline</v-icon>
      <div class="add-photo-title">Add New {{ mediaType }}</div>
    </div>
    <div v-if="showAutoflow" class="photo-btn autoflow" @click="autoflow">
      <v-icon>auto_fix_high</v-icon>
      <div class="autoflow-title">Autoflow {{ mediaType }}</div>
    </div>

    <slot />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
