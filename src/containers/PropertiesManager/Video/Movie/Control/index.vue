<template>
  <div class="control-container">
    <span class="properties-title">Control:</span>

    <div class="control-group">
      <SpeedControl
        :is-forward="false"
        @click="onRewind"
        @mouseDown="onKeepRewind"
        @mouseUp="onStopKeepRewind"
      />

      <v-btn text @click="onTogglePlay">
        <v-icon v-if="!isPlaying">mdi-play</v-icon>
        <v-icon v-else>mdi-pause</v-icon>
      </v-btn>

      <SpeedControl
        @click="onFastForward"
        @mouseDown="onKeepForward"
        @mouseUp="onStopKeepForward"
      />
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
