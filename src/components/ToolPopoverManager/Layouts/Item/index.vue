<template>
  <div
    class="layout-item"
    :class="{ 'layout-item-active': selectedLayoutId === layout.id }"
    @click="onClick"
  >
    <div class="layout-preview-img">
      <div class="layout-preview-img-left">
        <img
          v-show="layout.imageUrlLeft"
          :src="require(`@/assets/image/layouts/${layout.imageUrlLeft}`)"
          alt="left-layout"
        />
      </div>
      <div class="modal-preview-img-right">
        <img
          v-show="layout.imageUrlRight"
          alt="right-layout"
          :src="require(`@/assets/image/layouts/${layout.imageUrlRight}`)"
        />
      </div>
    </div>
    <div class="layout-preview-img-footer">
      <span class="layout-name">{{ layout.name }}</span>
      <v-icon>
        favorite_border
      </v-icon>
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
