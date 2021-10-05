<template>
  <div class="row thumbnail-view-row">
    <template v-for="section in sections">
      <ThumbnailItem
        v-for="sheet in section.sheets"
        :key="sheet.id"
        :sheet-id="sheet.id"
        :selected-sheet="selectedSheet"
        :name="section.name"
        :color="section.color"
        :section="section"
        :sheet-type="sheet.type"
        :link-type="sheet.link"
        :thumbnail-url="sheet.thumbnailUrl"
        :page-names="getPageNames(sheet)"
        :to-link="`/book/${bookId}/edit/print/edit-screen/${sheet.id}`"
        :is-enable="section.isAccessible"
        @closeMenu="onCloseMenu"
        @export="onExportPDF"
        @preview="onPreview(sheet.id)"
        @toggleMenu="toggleMenu(sheet.id)"
        @updateLink="changeLinkStatus(sheet.id, sheet.link)"
      />
    </template>
    <print-preview
      v-if="isOpenPreviewModal"
      :is-open-modal="isOpenPreviewModal"
      :sections="sections"
      :previewed-sheet-id="previewedSheetId"
      @cancel="onCloseModalPreview"
    ></print-preview>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
