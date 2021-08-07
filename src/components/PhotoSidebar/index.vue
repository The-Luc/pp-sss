<template>
  <transition name="slide-x-transition">
    <div v-show="isOpenPhotoSidebar" class="sidebar-photo">
      <PhotoContent
        :show-autoflow="isShowAutoflow"
        @click="closePhotoContent"
        @addPhoto="openModalAddPhoto"
        @autoflow="autoflowPhotos"
      >
        <slot />
      </PhotoContent>

      <ModalAddPhotos
        :is-open-modal.sync="isOpenModal"
        @select="onSelect"
        @cancel="onCancel"
        @uploadImages="onUploadImages"
      />

      <ModalAddMedia
        v-if="isOpenModalAddMedia"
        :files="files"
        :is-open-modal.sync="isOpenModalAddMedia"
        @cancel="onCancelAddMedia"
      />
    </div>
  </transition>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" scoped />
