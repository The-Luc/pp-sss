<template>
  <div class="col-3 thumbnail-view-item">
    <div class="thumbnail-view-container">
      <div class="thumbnail-view-header">
        <div>
          <div
            class="header-color"
            :style="{ 'background-color': `${section.color}` }"
          ></div>
          <div class="header-name">{{ section.name }}</div>
        </div>
        <div class="header-more">
          <v-icon class="icon-more">more_horiz</v-icon>
        </div>
      </div>
      <slot />
    </div>
  </div>
</template>
<script src="./script.js" />
<style lang="scss" scoped src="./style.scss" />
