<template>
  <div class="header">
    <v-icon
      class="toggle-icon"
      :class="{ 'detail-expand': isExpand }"
      @click.native="onToggleExpand"
    >
      arrow_right
    </v-icon>

    <div class="name">Frame {{ transitionIndex + 1 }}</div>

    <div class="symbol-link">
      <div class="square">
        <v-icon>auto_awesome_motion</v-icon>
      </div>
    </div>

    <div class="name">Frame {{ transitionIndex + 2 }}</div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
