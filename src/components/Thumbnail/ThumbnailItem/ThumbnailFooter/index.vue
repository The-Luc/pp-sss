<template>
  <div class="thumbnail-view-footer" :class="customCssClass">
    <div v-if="!isMiddleNameDisplayed" class="name-page">
      {{ pageLeftName }}
    </div>

    <div v-if="isLinkDisplayed" class="link-status" @click="changeLinkStatus">
      <v-icon class="icon-link" :class="linkData.cssClass">
        {{ linkData.icon }}
      </v-icon>
    </div>

    <div v-if="isMiddleNameDisplayed" class="name-page">
      {{ pageLeftName }}
    </div>

    <div v-if="!isMiddleNameDisplayed" class="name-page">
      {{ pageRightName }}
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
