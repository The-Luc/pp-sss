<template>
  <div class="general-container">
    <Control />
    <Volume />
    <div>
      <Trim />
      <PosterFrame />
    </div>
    <Playback />
    <div class="video-animation">
      <p class="animation-title">Video Animation:</p>
      <VideoAnimation title="Play In:" />
      <div class="horizontal-line"></div>
      <VideoAnimation title="Play Out:" />
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
