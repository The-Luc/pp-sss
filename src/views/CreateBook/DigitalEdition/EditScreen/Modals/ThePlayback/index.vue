<template>
  <the-preview
    :width="`${canvasSize.w}px`"
    :height="`${canvasSize.h}px`"
    :can-close-outside="true"
    @close="onClose"
  >
    The Playback {{ playbackData.length }}
  </the-preview>
</template>

<script src="./script.js" />
