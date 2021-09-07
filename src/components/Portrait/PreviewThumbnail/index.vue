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
      <div v-if="!isCenterPosition" ref="outside" class="names">
        <div
          v-for="(portrait, idx) in portraits"
          :key="idx"
          class="name"
          :style="nameTextStyle"
        >
          <div>{{ portrait.firstName }}</div>
          <div>{{ portrait.lastName }}</div>
        </div>
      </div>

      <div ref="portraits" class="portraits">
        <div v-for="(portrait, idx) in portraits" :key="idx" class="portrait">
          <div class="photo-container">
            <img
              class="photo"
              :src="portrait.imageUrl"
              :alt="portrait.firstName"
            />
          </div>

          <div v-if="isCenterPosition" class="name" :style="nameTextStyle">
            <div>{{ portrait.firstName }}</div>
            <div>{{ portrait.lastName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
