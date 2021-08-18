<template>
  <v-dialog
    id="add-photos"
    v-model="isOpenModal"
    content-class="modal-add-photo"
    persistent
    max-width="1162"
  >
    <div v-if="!isPhotoVisited" class="prompt"></div>
    <div v-if="isOpenModal" class="modal-body">
      <v-tabs v-model="defaultTab" fixed-tabs dark @change="onChangeTab">
        <v-tabs-slider color="transparent"></v-tabs-slider>
        <v-tab href="#smartbox">
          <i class="light"></i>
          <div>Smartbox</div>
        </v-tab>
        <v-tab-item value="smartbox">
          <Smartbox
            :key="currentTab"
            :selected-media="selectedImages"
            :keywords="keywords"
            :photos="photos"
            :is-photo-visited="isPhotoVisited"
            @clickGotIt="onClickGotIt"
            @clickKeyword="onClickKeyword"
            @change="onSelectedImage"
          />
        </v-tab-item>

        <v-tab href="#photos">
          <v-icon>collections</v-icon>
          <div>Photos</div>
        </v-tab>
        <v-tab-item value="photos">
          <TabPhotos
            :key="currentTab"
            :selected-images="selectedImages"
            :selected-type="selectedType"
            :albums="albums"
            :photo-dropdowns="photoDropdowns"
            @changeType="onChangeType"
            @change="onSelectedImage"
          />
        </v-tab-item>

        <v-tab href="#search">
          <v-icon>search</v-icon>
          <div>Search</div>
        </v-tab>
        <v-tab-item value="search">
          <TabSearchPhotos
            :key="currentTab"
            :selected-media="selectedImages"
            :photos="photos"
            @search="onSearch"
            @change="onSelectedImage"
          />
        </v-tab-item>

        <v-tab href="#add">
          <v-icon>add</v-icon>
          <div>Add</div>
        </v-tab>
        <v-tab-item value="add">
          <TabUploadMedia
            :key="currentTab"
            :media-types="mediaTypes"
            @change="onUploadImages"
          />
        </v-tab-item>
      </v-tabs>
    </div>
    <Footer
      :is-media-additional-displayed="isMediaAdditionalDisplayed"
      :is-disabled="selectedImages.length === 0"
      @select="onSelect"
      @cancel="onCancel"
    />
  </v-dialog>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
