<template>
  <div class="upload-new-photos-container">
    <div class="content">
      <div class="notify">
        <template v-if="showNotification">
          Invalid file type detected. Only files with the following extensions
          are allowed: PNG, JPG/JPEG, HEIC, and GIF
        </template>
      </div>
      <div
        ref="dropzone"
        class="dropzone"
        @dragover.prevent
        @drop.prevent="onDrop"
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
          :accept="imageTypes"
          @change="onChangeFile"
        />
      </div>
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
