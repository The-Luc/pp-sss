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
      <AlbumItem
        v-for="album in albumsSelected"
        :key="album.id"
        :name="album.name"
        :display-date="album.displayDate"
        :assets="album.assets"
        :selected-images="selectedImages"
        @change="onSelectedImage"
      />
    </div>
    <PopupSelected v-if="isShowPopupSelected" :amount="selectedImages.length" />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
