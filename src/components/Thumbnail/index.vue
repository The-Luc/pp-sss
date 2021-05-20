<template>
  <div>
    <div
      :class="[
        {
          'half-left': sheet.type === SHEET_TYPES.INTRO,
          'half-right': sheet.type === SHEET_TYPES.SIGNATURE,
          active: isActive
        },
        'thumbnail-view-thumbnail'
      ]"
    >
      <img :src="image" />
      <div v-if="edit" class="thumbnail-edit">
        <router-link tag="div" :to="toLink">
          <v-icon class="icon-edit">edit</v-icon>
        </router-link>
      </div>
    </div>
    <div class="thumbnail-view-number-page">
      <div class="number-page-left">{{ numberPage.numberLeft }}</div>
      <div class="number-page-link">
        <v-icon
          v-if="sheet.printData.link === LINK_STATUS.LINK && isShowLink"
          class="icon-link"
          >link</v-icon
        >
        <v-icon
          v-if="sheet.printData.link === LINK_STATUS.UNLINK && isShowLink"
          class="icon-link"
          >link_off</v-icon
        >
      </div>
      <div class="number-page-right">{{ numberPage.numberRight }}</div>
    </div>
  </div>
</template>
<script src="./script.js" />
<style lang="scss" scoped src="./style.scss" />
