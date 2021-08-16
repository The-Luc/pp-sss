<template>
  <div class="control-container">
    <span class="properties-title">Control:</span>
    <div class="control-group">
      <v-btn text @click="onClickRewind">
        <v-icon>fast_rewind</v-icon>
      </v-btn>
      <v-btn text @click="onClickPlay">
        <v-icon v-if="!isPlaying">mdi-play</v-icon>
        <v-icon v-else>mdi-pause</v-icon>
      </v-btn>
      <v-btn text @click="onClickFastForward">
        <v-icon>fast_forward</v-icon>
      </v-btn>
    </div>
  </div>
</template>
<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
