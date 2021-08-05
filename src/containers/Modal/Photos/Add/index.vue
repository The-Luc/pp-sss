<template>
  <div class="upload-new-photos-container">
    <div class="content">
      <div class="notify">
        {{ notifyContent }}
      </div>
      <div
        ref="dropzone"
        class="dropzone"
        @dragover.prevent
        @drop.prevent="onChangeFile"
        @dragenter.prevent="onDragEnter"
        @dragleave.prevent="onDragLeave"
      >
        Drag and drop files or folders here
      </div>
      <div class="button-upload-photo">
        <label class="label-upload-photo" for="input-upload-photo">
          Access My Files
        </label>
        <input
          id="input-upload-photo"
          ref="uploadPhoto"
          class="input-upload-photo"
          type="file"
          name="photo"
          multiple
          :accept="acceptInput"
          @change="onChangeFile"
        />
      </div>
    </div>
    <div class="note">
      Note: Photos added here will also be added to your Private Stream
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
