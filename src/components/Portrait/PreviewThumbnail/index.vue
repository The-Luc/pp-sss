<template>
  <div
    class="preview-thumbnail"
    :style="{ backgroundImage: backgroundUrl && `url(${backgroundUrl})` }"
  >
    <div ref="thumbWrapper" class="thumb-wrapper">
      <div class="names"></div>

      <div ref="portraits" class="portraits">
        <div v-for="(portrait, idx) in portraits" :key="idx" class="portrait">
          <div class="photo-container">
            <img
              class="photo"
              :src="portrait.imageUrl"
              :alt="portrait.firstName"
            />
          </div>

          <div class="name">
            {{ portrait.firstName + ' ' + portrait.lastName }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
