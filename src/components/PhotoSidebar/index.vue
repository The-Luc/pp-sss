<template>
  <div class="sidebar-photo">
    <PhotoContent
      :show-autoflow="isShowAutoflow"
      :media-type="mediaType"
      @click="closePhotoContent"
      @addPhoto="openModalAddPhoto"
      @autoflow="autoflowPhotos"
    >
      <slot />
    </PhotoContent>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" scoped />
