<template>
  <transition name="slide-x-transition">
    <div v-show="isOpenPhotoSidebar" class="sidebar-photo">
      <PhotoContent
        :show-autoflow="true"
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
      />
    </div>
  </transition>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" scoped />
