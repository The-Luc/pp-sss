<template>
  <div class="playback-container">
    <span class="properties-title">Playback:</span>
    <Select
      :items="playbackOptions"
      :selected-val="selectedPlayback"
      @change="onChangePlayback"
    />
    <span class="properties-title">Repeat:</span>
    <Select
      :items="repeatOptions"
      :selected-val="selectedRepeat"
      @change="onChangeRepeat"
    />
  </div>
</template>
<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
