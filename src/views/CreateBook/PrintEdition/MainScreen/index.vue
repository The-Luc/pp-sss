<template>
  <div class="row thumbnail-view-row">
    <template v-for="section in sections">
      <ThumbnailItem
        v-for="sheet in section.sheets"
        :key="sheet.id"
        :name="section.name"
        :color="section.color"
        :sheet-type="sheet.type"
        :link-type="sheet.link"
        :thumbnail-url="sheet.thumbnailUrl"
        :page-names="getPageNames(sheet)"
        :to-link="`/book/${bookId}/edit/print/edit-screen/${sheet.id}`"
        :is-enable="section.isAccessible"
        @updateLink="changeLinkStatus(sheet.id, sheet.link)"
      />
    </template>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
