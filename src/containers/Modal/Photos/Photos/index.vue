<template>
  <div class="add-new-photos-container">
    <div class="header">
      <div class="dropdown">
        <SelectPhotoType
          :items="dropdownOptions"
          :selected-val="selectedType"
          @change="onChangeType"
        />
      </div>
    </div>
    <div class="content">
      <template v-if="!isEmptyCategory">
        <AlbumItem
          v-for="album in selectedAlbums"
          :key="album.id"
          :name="album.name"
          :display-date="album.displayDate"
          :assets="album.assets"
          :selected-images="selectedImages"
          @change="onSelectedImage"
        />
      </template>

      <template v-else>
        <AlbumItem :empty-category="currentCategory" />
      </template>
    </div>
    <PopupSelected v-if="isShowPopupSelected" :amount="selectedImages.length" />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
