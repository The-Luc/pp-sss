<template>
  <div class="row thumbnail-view-row">
    <template v-for="section in sections">
      <ThumbnailItem
        v-for="sheet in section.sheets"
        :key="sheet.id"
        :name="section.name"
        :color="section.color"
        :thumbnail-url="sheet.thumbnailUrl"
        :page-names="getPageName(sheet)"
        :to-link="`/book/${bookId}/edit/digital/edit-screen/${sheet.id}`"
        :is-enable="section.isAccessible"
        :is-digital="true"
      />
    </template>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
