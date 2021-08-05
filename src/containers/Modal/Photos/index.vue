<template>
  <v-dialog
    id="add-photos"
    v-model="isOpenModal"
    content-class="modal-add-photo"
    persistent
    max-width="1162"
  >
    <div class="modal-body">
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
          <Photos
            :key="currentTab"
            :selected-images="selectedImages"
            @change="onSelectedImage"
          />
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
          <Add :key="currentTab" />
        </v-tab-item>
      </v-tabs>
    </div>
    <Footer
      v-if="isShowFooter"
      :is-disabled="selectedImages.length === 0"
      @select="onSelect"
      @cancel="onCancel"
    />
  </v-dialog>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
