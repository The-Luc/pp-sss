<template>
  <div class="add-new-photos-container">
    <div class="header">
      <div class="dropdown">
        <PpSelect
          :id="dropdownId"
          :container="`#${dropdownId}`"
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
          :selected-images="selectedMedia"
          @change="onSelectedMedia"
        />
      </template>

      <template v-else>
        <AlbumItem :empty-category="currentCategory" />
      </template>
    </div>
    <PopupSelected v-if="isShowPopupSelected" :amount="selectedMedia.length" />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
