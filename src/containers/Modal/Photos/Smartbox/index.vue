<template>
  <div class="smartbox-container">
    <GotIt
      v-if="!isPhotoVisited"
      :title="promptTitle"
      :message="promptMsg"
      @click="onClickGotIt"
    />
    <div class="header">
      <div class="keyword-title">Showing results for:</div>
      <div class="keyword-content">
        <Tags
          v-for="(keyword, index) in keywords"
          :key="index"
          :key-word="keyword"
          @click="onClickKeyword"
        />
      </div>
    </div>
    <div class="content">
      <AlbumItem
        :display-date="numberResult"
        :assets="photos"
        :selected-images="selectedImages"
        @change="onSelectedImage"
      />
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
