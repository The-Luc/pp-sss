<template>
  <div>
    <div
      ref="thumbnailContainer"
      :class="[
        {
          'half-left': sheet.type === SHEET_TYPE.FRONT_COVER,
          'half-right': sheet.type === SHEET_TYPE.BACK_COVER,
          active: isActive
        },
        'thumbnail-view-thumbnail'
      ]"
      :style="{
        backgroundImage: `url(${thumbnailUrl ||
          require('@/assets/image/white.png')})`,
        backgroundSize: 'cover'
      }"
    >
      <div class="border-inside"></div>
      <div v-if="edit" class="thumbnail-edit">
        <router-link tag="div" :to="toLink">
          <v-icon class="icon-edit">edit</v-icon>
        </router-link>
      </div>
    </div>
    <div class="thumbnail-view-number-page" :style="{ fontSize: fontSize }">
      <div class="number-page-left">{{ numberPage.numberLeft }}</div>
      <div
        v-if="sheet.link === LINK_STATUS.LINK && isShowLink"
        class="number-page-link"
        @click="changeLinkStatus"
      >
        <v-icon class="icon-link">link</v-icon>
      </div>
      <div
        v-if="sheet.link === LINK_STATUS.UNLINK && isShowLink"
        class="number-page-link"
        @click="changeLinkStatus"
      >
        <v-icon class="icon-link unlink">link_off</v-icon>
      </div>
      <div class="number-page-right">{{ numberPage.numberRight }}</div>
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" scoped src="./style.scss" />
