<template>
  <div :style="{ opacity: isShowCanvas ? 1 : 0 }">
    <the-preview :can-close-outside="true" @close="onClose">
      <playback
        :playback-data="playbackData"
        @finish="onClose"
        @showCanvas="onShowCanvas"
      ></playback>
    </the-preview>
  </div>
</template>

<script src="./script.js" />
