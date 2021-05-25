<template>
  <div>
    <div class="modal-preview-header">
      <v-icon></v-icon>
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
              v-if="layout.imageUrlLeft"
              src="@/assets/image/layouts/layout14l.jpg"
            />
          </div>
          <div class="modal-preview-img-right">
            <img
              v-if="layout.imageUrlRight"
              src="@/assets/image/layouts/layout14r.jpg"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
