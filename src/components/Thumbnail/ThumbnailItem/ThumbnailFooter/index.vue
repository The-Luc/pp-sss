<template>
  <div class="thumbnail-view-footer" :class="customCssClass">
    <div class="name-page">{{ pageNames.left }}</div>

    <div v-if="isLinkDisplayed" class="link-status" @click="changeLinkStatus">
      <v-icon class="icon-link" :class="linkData.cssClass">
        {{ linkData.icon }}
      </v-icon>
    </div>

    <div v-if="isMiddleNameDisplayed" class="name-page">
      {{ pageNames.middle }}
    </div>

    <div class="name-page">{{ pageNames.right }}</div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
