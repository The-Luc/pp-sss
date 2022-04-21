<template>
  <div class="clip-art-container">
    <ClipArtToolPopover
      :clip-art-types="displayClipArtTypes"
      :chosen-clip-art-type="chosenClipArtType"
      :clip-arts="clipArtList"
      :selected-clip-art-id="selectedClipArtId"
      @search="onSearch"
      @selectClipArt="selectClipArt"
      @onCancel="onCancel"
      @addClipArts="addClipArts"
      @onChangeClipArtType="onChangeClipArtType"
    />
  </div>
</template>

<script src="./script.js" />
