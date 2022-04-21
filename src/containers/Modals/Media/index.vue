<template>
  <div v-if="isOpenModal">
    <MediaViewer
      :type="type"
      :is-open-modal="isOpenMediaModal"
      :selected-album-id="selectedAlbumId"
      @select="handleSelectedImages"
      @setAlbumId="setSelectedAlbumId"
      @cancel="onCancel"
      @uploadMedia="handleUploadingMedia"
    />
    <MediaUploader
      :files="files"
      :is-open-modal="isOpenUploadModal"
      @onDoneUpload="onDoneUpload"
      @cancel="onCancelUploadModal"
    />
  </div>
</template>

<script src="./script.js" />
