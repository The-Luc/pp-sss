<template>
  <v-dialog
    id="add-photos"
    v-model="isOpenModal"
    content-class="modal-add-photo"
    persistent
    max-width="1162"
  >
    <div v-if="false" class="prompt"></div>
    <div v-if="isOpenModal" class="modal-body">
      <v-tabs v-model="defaultTab" fixed-tabs dark @change="onChangeTab">
        <v-tabs-slider color="transparent"></v-tabs-slider>
        <v-tab href="#smart-box">
          <i class="light"></i>
          <div>Smartbox</div>
        </v-tab>
        <v-tab-item value="smart-box">
          Smartbox
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
          search
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
    <Footer :is-disabled="true" @select="onSelect" @cancel="onCancel" />
  </v-dialog>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
