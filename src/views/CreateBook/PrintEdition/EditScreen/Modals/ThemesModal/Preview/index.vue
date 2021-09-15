<template>
  <div>
    <div class="modal-preview-header">
      <div class="modal-preview-back" @click="onClosePreview">
        <v-icon class="icon">west</v-icon>
      </div>
      <div class="modal-preview-title">{{ themeName }}</div>
    </div>
    <div class="modal-preview-container">
      <div
        v-for="layout in layouts"
        :key="layout.id"
        class="modal-preview-item"
      >
        <div class="modal-preview-img">
          <div class="modal-preview-img-left">
            <img
              v-if="layout.previewImageUrl"
              :src="layout.previewImageUrl"
              alt="left thumbnail"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
