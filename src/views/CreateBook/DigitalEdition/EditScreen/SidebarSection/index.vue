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
        v-for="sheet in section.sheets"
        v-show="checkIsExpand(section.id)"
        :key="`${section.id}-${sheet.id}`"
        :ref="`screen${sheet.id}`"
        :name="section.name"
        :color="section.color"
        :thumbnail-url="sheet.thumbnailUrl"
        :page-names="getPageName(sheet)"
        :total-item="section.sheets.length"
        :is-active="checkIsActive(sheet)"
        :is-enable="section.isAccessible"
        :is-editor="true"
        :is-digital="true"
        @select="onSelectSheet(sheet)"
      />
    </template>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
