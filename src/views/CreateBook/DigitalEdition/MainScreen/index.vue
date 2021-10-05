<template>
  <div class="row thumbnail-view-row">
    <template v-for="section in sections">
      <ThumbnailItem
        v-for="sheet in section.sheets"
        :key="sheet.id"
        :sheet-id="sheet.id"
        :selected-sheet="selectedSheet"
        :section="section"
        :name="section.name"
        :color="section.color"
        :thumbnail-url="sheet.thumbnailUrl"
        :page-names="getPageName(sheet)"
        :to-link="`/book/${bookId}/edit/digital/edit-screen/${sheet.id}`"
        :is-enable="section.isAccessible"
        :is-digital="true"
        @toggleMenu="toggleMenu(sheet.id)"
        @closeMenu="onCloseMenu"
      />
    </template>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
