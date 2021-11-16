<template>
  <div class="album-container">
    <div v-if="!emptyCategory.name" class="album-title">
      <div class="album-name">
        {{ name }}
        <span> {{ searchInput }}</span>
      </div>
      <div class="album-date">{{ displayDate }}</div>
    </div>
    <div v-else class="empty-category">
      There are no {{ emptyCategory.type }} in
      <span>{{ emptyCategory.name }}</span>
    </div>
    <div class="image-container">
      <div
        v-for="asset in assets"
        :key="asset.id"
        :class="[
          'image-item',
          { active: isActive(asset.id, asset.albumId) },
          { 'video-item': isVideo(asset.type) }
        ]"
        @click="onSelected(asset)"
      >
        <v-icon class="icon-check">done</v-icon>
        <img :src="asset.thumbUrl" alt="thumbnail" />
        <div v-show="asset.inProject" class="indicator">In Project</div>
        <div class="duration">{{ asset.duration }}</div>
      </div>
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
