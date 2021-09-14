<template>
  <div class="image-setting-container">
    <div class="title-setting">
      Image Settings
    </div>

    <Border :current-border="imageSettings.border" @change="onBorderChange" />

    <Shadow
      :current-shadow="imageSettings.shadow"
      @change="onShadowChange"
      @changeDropShadow="onShadowChange"
    />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
