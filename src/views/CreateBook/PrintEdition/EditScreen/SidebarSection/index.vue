<template>
  <div class="sidebar-section">
    <template v-for="section in sections">
      <ThumbnailHeaderGroup
        :key="section.id"
        :name="section.name"
        :color="section.color"
        :total-item="section.sheets.length"
        :is-enable="section.isAccessible"
        :is-expanded="checkIsExpand(section.id)"
        @toggleContent="onToggleSheets(section.id)"
      />
      <ThumbnailItem
        v-show="checkIsExpand(section.id)"
        v-for="sheet in section.sheets"
        :key="`${section.id}-${sheet.id}`"
        :ref="`spread${sheet.id}`"
        :name="section.name"
        :color="section.color"
        :sheet-type="sheet.type"
        :thumbnail-url="sheet.thumbnailUrl"
        :ordered-number="pageNumber(sheet)"
        :total-item="section.sheets.length"
        :is-active="checkIsActive(sheet)"
        :is-enable="section.isAccessible"
        :is-editor="true"
      />
    </template>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
