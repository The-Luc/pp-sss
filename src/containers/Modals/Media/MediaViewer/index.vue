<template>
  <v-dialog
    id="add-photos"
    v-model="isOpenModal"
    content-class="modal-add-photo"
    persistent
    max-width="1162"
  >
    <div v-if="!isPhotoVisited" class="prompt"></div>
    <div
      v-if="isOpenModal"
      :class="[
        'modal-body',
        {
          media: isModalMedia
        }
      ]"
    >
      <v-tabs v-model="defaultTab" fixed-tabs dark @change="onChangeTab">
        <v-tabs-slider color="transparent"></v-tabs-slider>
        <v-tab href="#smartbox">
          <i class="light"></i>
          <div>Smartbox</div>
        </v-tab>
        <v-tab-item value="smartbox">
          <Smartbox
            :key="currentTab"
            :selected-media="selectedMedia"
            :keywords="keywords"
            :photos="photos"
            :is-photo-visited="isPhotoVisited"
            @clickGotIt="onClickGotIt"
            @clickKeyword="onClickKeyword"
            @change="onSelectedMedia"
          />
        </v-tab-item>

        <v-tab href="#photos">
          <v-icon>collections</v-icon>
          <div>Photos</div>
        </v-tab>
        <v-tab-item value="photos">
          <TabMedia
            :key="currentTab"
            :selected-media="selectedMedia"
            :selected-type="selectedType"
            :albums="albums"
            :media-dropdowns="mediaDropdowns"
            @changeType="onChangeType"
            @change="onSelectedMedia"
            @loadMoreAssets="onLoadMoreAssets"
          />
        </v-tab-item>

        <v-tab v-show="isModalMedia" href="#videos">
          <v-icon>videocam</v-icon>
          <div>Videos</div>
        </v-tab>
        <v-tab-item value="videos">
          <TabMedia
            :key="currentTab"
            :selected-media="selectedMedia"
            :selected-type="selectedType"
            :albums="albums"
            :media-dropdowns="mediaDropdowns"
            :is-video="true"
            @changeType="onChangeType"
            @change="onSelectedMedia"
            @loadMoreAssets="onLoadMoreAssets"
          />
        </v-tab-item>

        <v-tab v-show="isModalMedia" href="#compositions" class="disabled">
          <v-icon>collections_bookmark</v-icon>
          <div>Compositions</div>
        </v-tab>
        <v-tab-item value="compositions">
          compositions
        </v-tab-item>

        <v-tab href="#search">
          <v-icon>search</v-icon>
          <div>Search</div>
        </v-tab>
        <v-tab-item value="search">
          <TabSearchPhotos
            :key="currentTab"
            :selected-media="selectedMedia"
            :photos="photos"
            @search="onSearch"
            @change="onSelectedMedia"
          />
        </v-tab-item>

        <v-tab href="#add">
          <v-icon>add</v-icon>
          <div>Add</div>
        </v-tab>
        <v-tab-item value="add">
          <TabUploadMedia
            :key="currentTab"
            :is-modal-media="isModalMedia"
            @change="onUploadMedia"
          />
        </v-tab-item>
      </v-tabs>
    </div>
    <Footer
      :is-media-additional-displayed="isMediaAdditionalDisplayed"
      :is-disabled="isNoSelectMedia"
      @select="onSelect"
      @cancel="onCancel"
    />
  </v-dialog>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
