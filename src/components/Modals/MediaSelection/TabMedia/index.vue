<template>
  <div class="add-new-photos-container">
    <div class="header">
      <div class="dropdown">
        <PpSelect
          :id="dropdownId"
          :container="`#${dropdownId}`"
          :items="dropdownOptions"
          :selected-val="selectedType"
          @changeDisplaySelected="changeDisplaySelected"
          @change="onChangeType"
        />
      </div>
    </div>
    <div class="content">
      <template v-if="!isEmptyCategory && hasAssets">
        <AlbumItem
          v-for="(album, idx) in selectedAlbums"
          :key="album.id"
          :ref="`album-${idx}`"
          :name="album.name"
          :display-date="album.displayDate"
          :assets="album.assets"
          :selected-images="selectedMedia"
          @change="asset => onSelectedMedia(asset, album.id)"
        />
      </template>

      <template v-else>
        <AlbumItem :empty-category="emptyCategory" />
      </template>

      <div :ref="`loadingMark`"></div>
    </div>
    <PopupSelected v-if="isShowPopupSelected" :amount="selectedMedia.length" />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
