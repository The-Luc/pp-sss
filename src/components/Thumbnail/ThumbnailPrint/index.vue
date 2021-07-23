<template>
  <div>
    <div
      class="thumbnail-view-thumbnail"
      :class="[thumnailCssClass, disabledCssClass]"
      :style="{ backgroundImage: thumbnailUrl && `url(${thumbnailUrl})` }"
    >
      <div class="border-inside"></div>

      <div
        v-if="isEditIconDisplayed"
        class="thumbnail-edit"
        :class="disabledCssClass"
      >
        <router-link tag="div" class="icon-wrapper" :to="toLink">
          <v-icon class="icon-edit">edit</v-icon>
        </router-link>
      </div>
    </div>

    <div class="thumbnail-view-number-page" :class="pageDisplayCssClass">
      <div class="number-page-left">{{ numberPage.numberLeft }}</div>
      <div
        v-if="isLinkDisplayed"
        class="number-page-link"
        :class="disabledCssClass"
        @click="changeLinkStatus"
      >
        <v-icon class="icon-link" :class="linkData.cssClass">
          {{ linkData.icon }}
        </v-icon>
      </div>
      <div class="number-page-right">{{ numberPage.numberRight }}</div>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
