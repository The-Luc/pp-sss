<template>
  <div class="image-setting-container">
    <div class="title-setting">
      Image Settings
    </div>

    <pp-border :current-border="imageSettings.border" @change="onBorderChange">
    </pp-border>

    <pp-shadow
      :current-shadow="imageSettings.shadow"
      @change="onShadowChange"
      @changeDropShadow="onShadowChange"
    >
    </pp-shadow>
    <div class="image-mask">
      <div class="image-mask-title">Image Mask:</div>
      <mask-select
        :items="maskOptions"
        :selected-val="selectedMask"
        @change="onMaskChange"
      >
      </mask-select>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
