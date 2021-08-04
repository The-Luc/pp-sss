<template>
  <div class="sidebar-photo">
    <transition name="slide-x-transition">
      <PhotoContent
        v-show="isOpenPhotoSidebar"
        :show-autoflow="true"
        @click="closePhotoContent"
        @addPhoto="openModalAddPhoto"
        @autoflow="autoflowPhotos"
      >
      </PhotoContent>
    </transition>

    <ModalAddPhotos
      :is-open-modal.sync="isOpenModal"
      @select="onSelect"
      @cancel="onCancel"
    />
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" scoped />
