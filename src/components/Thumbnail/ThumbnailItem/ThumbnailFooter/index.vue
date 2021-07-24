<template>
  <div class="thumbnail-view-footer" :class="customCssClass">
    <div class="number-page">{{ orderedNumber.numberLeft }}</div>

    <div
      v-if="isLinkDisplayed"
      class="number-page-link"
      @click="changeLinkStatus"
    >
      <v-icon class="icon-link" :class="linkData.cssClass">
        {{ linkData.icon }}
      </v-icon>
    </div>

    <div v-if="isNumberMiddleDisplayed" class="number-page">
      {{ orderedNumber.numberMiddle }}
    </div>

    <div class="number-page">{{ orderedNumber.numberRight }}</div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
