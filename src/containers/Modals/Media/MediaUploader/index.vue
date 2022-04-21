<template>
  <v-dialog
    id="add-media"
    v-model="isOpenModal"
    content-class="modal-add-media"
    persistent
    max-width="425"
  >
    <div v-if="!isUploadCompleteProcess" class="header">
      {{ modalHeader }}
    </div>

    <div v-if="isAlbumSelectionProcess" class="select-album">
      <Title
        content="Select from your existing albums or start tying to create a new one"
      />
      <div class="select-container">
        <AlbumAutocomplete
          :albums="albums"
          @changeSelect="onChangeSelect"
          @createNewAlbum="onCreateNewAlbum"
        />
      </div>
      <div class="btn-container">
        <PpButton
          class="button"
          is-active
          :is-disabled="isAddMediaButtonDisabled"
          @click.native="onAddMedia"
        >
          Add Media
        </PpButton>
        <PpButton class="button button-cancel" @click.native="onCancel">
          Cancel
        </PpButton>
      </div>
    </div>

    <div v-if="isUploadingStartProcess" class="starting-upload">
      <Title
        name="Starting Upload"
        content="We’re preparing your selections…"
      />
    </div>

    <div v-if="isUploadingProcess" class="uploading">
      <Title name="Uploading" content="We’re uploading your selections…" />
      <div class="bar">
        <div
          class="bar-content"
          :style="{
            width: `${(numberOfFilesUploaded / files.length) * 100}%`
          }"
        ></div>
      </div>
      <div class="total-files">
        {{ numberOfFilesUploaded }} of {{ files.length }}
      </div>
    </div>

    <div v-if="isUploadCompleteProcess" class="uploaded-success">
      <div class="icon">
        <img :src="iconSuccess" alt="arrow-select" />
      </div>
      <Title name="Success!" content="Your selections have been added." />
    </div>
  </v-dialog>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
