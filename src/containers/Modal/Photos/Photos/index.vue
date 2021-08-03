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
    <div class="body">
      <AlbumItem
        v-for="album in albumsSelected"
        :key="album.id"
        :name="album.name"
        :display-date="album.displayDate"
        :assets="album.assets"
        :images-selected="imagesSelected"
        @change="onSelectedImage"
      />
    </div>
    <PopupSelected
      v-if="imagesSelected.length !== 0"
      :amount="imagesSelected.length"
    />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
