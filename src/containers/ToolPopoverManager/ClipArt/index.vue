<template>
  <div class="clip-art-container">
    <ClipArtToolPopover
      :clip-art-types="displayClipArtTypes"
      :chosen-clip-art-type="chosenClipArtType"
      :clip-arts="clipArts"
      :selected-clip-art-id="selectedClipArtId"
      @selectClipArt="selectClipArt"
      @onCancel="onCancel"
      @addClipArts="addClipArts"
      @onChangeClipArtType="onChangeClipArtType"
    />
  </div>
</template>

<script src="./script.js" />
