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
        :selected-images="selectedMedia"
        @change="onSelectedMedia"
      />
    </div>
    <PopupSelected v-if="isShowPopupSelected" :amount="selectedMedia.length" />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
