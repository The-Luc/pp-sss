<template>
  <div
    class="preview-thumbnail"
    :style="{ backgroundImage: backgroundUrl && `url(${backgroundUrl})` }"
  >
    <div
      v-show="showPageTitile"
      ref="pageTitle"
      class="page-title"
      :style="pageTitleStyle"
    >
      {{ flowSettings.textSettings.pageTitle }}
    </div>
    <div ref="thumbWrapper" class="thumb-wrapper">
      <div
        v-show="!isCenterPosition"
        :class="['name-container', { right: isPageRight }]"
        :style="nameContainerStyle"
      >
        <div
          v-for="(item, index) in namePortrait"
          :key="index"
          class="names"
          :style="namesHeight"
        >
          <div
            v-for="(portrait, i) in item"
            :key="i"
            class="name"
            :style="nameTextStyle"
          >
            <div>{{ portrait.firstName }}</div>
            <div :class="{ lastName: !isFirstLastDisplay }">
              {{ portrait.lastName }}
            </div>
          </div>
        </div>
      </div>
      <div ref="portraitsContainer" class="portraits-container">
        <div ref="portraits" class="portraits">
          <div
            v-for="(portrait, idx) in portraits"
            :key="idx"
            :class="{ portrait, enlarge: isLargePortrait(portrait) }"
          >
            <div class="photo-container">
              <img
                class="photo"
                :src="portrait.imageUrl"
                :alt="portrait.firstName"
              />
            </div>

            <div v-if="isCenterPosition" class="name" :style="nameTextStyle">
              <div>{{ portrait.firstName }}</div>
              <div :class="{ lastname: !isFirstLastDisplay }">
                {{ portrait.lastName }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
