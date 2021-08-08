<template>
  <div class="search-container">
    <div :key="input" class="header">
      <input type="text" placeholder="Search" @keyup.enter="onSearch" />
    </div>
    <div class="content">
      <AlbumItem
        v-if="!firstTime"
        name="Search:"
        :search-input="input"
        :display-date="numberResult"
        :assets="photos"
        :selected-images="selectedImages"
        @change="onSelectedImage"
      />
    </div>
    <PopupSelected v-if="isShowPopupSelected" :amount="selectedImages.length" />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
