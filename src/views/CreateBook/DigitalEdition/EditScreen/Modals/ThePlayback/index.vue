<template>
  <the-preview :can-close-outside="true" @close="onClose">
    <playback :playback-data="playbackData" @finish="onClose"></playback>
  </the-preview>
</template>

<script src="./script.js" />
