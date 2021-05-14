<template>
  <div>
    <div
      :class="[
        {
          'half-left': sheet.type === 'intro',
          'half-right': sheet.type === 'signature'
        },
        'thumbnail-view-thumbnail'
      ]"
    >
      <img :src="image" />
      <div class="thumbnail-edit">
        <v-icon class="icon-edit">edit</v-icon>
      </div>
    </div>
    <div class="thumbnail-view-number-page">
      <div class="number-page-left">{{ numberPage.numberLeft }}</div>
      <div v-if="isTypeFull" class="number-page-link">
        <v-icon v-show="sheet.printData.link === 'link'" class="icon-link"
          >link</v-icon
        >
        <v-icon v-show="sheet.printData.link === 'unlink'" class="icon-link"
          >link_off</v-icon
        >
      </div>
      <div class="number-page-right">{{ numberPage.numberRight }}</div>
    </div>
  </div>
</template>
<script src="./script.js" />
<style lang="scss" scoped src="./style.scss" />
