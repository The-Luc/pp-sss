<template>
  <div
    v-if="!isEmpty"
    class="layout-item"
    :class="{
      'layout-item-active': selectedLayoutId === layout.id,
      'layout-item-mapped': isMappedLayout
    }"
    @click="onClick"
  >
    <div class="border-inside"></div>
    <div class="layout-preview-img">
      <div
        v-if="isMappedLayout"
        class="overlay"
        :class="{ 'print-edition': !isDigital }"
      >
        <div class="overlay__info">
          <p>
            Mapped with <br />
            {{ isDigital ? 'print' : 'digital' }} layout
          </p>
          <span>{{ layout.mappings.theOtherLayoutTitle }}</span>
        </div>
        <div class="overlay__btn">
          <v-btn outlined color="white" @click="onEditMap">
            <v-icon small>
              mdi-pencil
            </v-icon>
            Edit Map</v-btn
          >
          <v-btn outlined color="white" @click="onReassign">
            <img
              class="hover-icon"
              :src="iconLocal.DIRECTIONS"
              alt="direction icon"
            />
            Reassign</v-btn
          >
          <v-btn outlined color="white" @click="onDeleteMap">
            <v-icon small>
              mdi-delete
            </v-icon>
            Delete Map</v-btn
          >
        </div>
      </div>
      <img
        v-if="!isOnPreview"
        :src="layout.previewImageUrl"
        alt="layout-preview"
      />

      <playback
        v-else
        :playback-data="previewData"
        @finish="onFinishPreview"
      ></playback>
    </div>
    <div class="layout-preview-img-footer">
      <span class="layout-name">{{ layout.name }}</span>
      <div class="layout-opts">
        <v-icon
          v-if="isDigital"
          class="layout-opts__play-icon"
          :class="{ disabled: isPreviewDisabled }"
          @click="onPreview"
        >
          play_circle_outline
        </v-icon>

        <div
          v-if="isDigital"
          class="layout-opts__preview"
          :class="{ disabled: isPreviewDisabled }"
          @click="onPreview"
        >
          Preview
        </div>

        <v-icon
          v-if="!isFavoritesDisabled"
          :class="favoriteData.cssClass"
          @click="onSaveToFavorites"
        >
          {{ favoriteData.iconName }}
        </v-icon>
      </div>
    </div>
  </div>
  <div v-else class="layout-item" />
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
