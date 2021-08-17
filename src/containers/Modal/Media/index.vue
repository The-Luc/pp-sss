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
          photos
        </v-tab-item>

        <v-tab href="#videos">
          <v-icon>videocam</v-icon>
          <div>Videos</div>
        </v-tab>
        <v-tab-item value="videos">
          videos
        </v-tab-item>

        <v-tab href="#compositions">
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
          <TabSearch
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
          add
        </v-tab-item>
      </v-tabs>
    </div>
    <Footer
      :is-disabled="selectedMedia.length === 0"
      @select="onSelect"
      @cancel="onCancel"
    />
  </v-dialog>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
