<template>
  <div v-scroll.self="onCloseMenu" class="row thumbnail-view-row">
    <template v-for="section in sections">
      <thumbnail-item
        v-for="sheet in section.sheets"
        :key="sheet.id"
        :name="section.name"
        :color="section.color"
        :sheet-type="sheet.type"
        :link-type="sheet.link"
        :left-thumbnail-url="sheet.thumnailLeftUrl"
        :right-thumbnail-url="sheet.thumnailRightUrl"
        :page-names="getPageNames(sheet)"
        :to-link="`/book/${bookId}/edit/print/edit-screen/${sheet.id}`"
        :is-enable="section.isAccessible"
        :is-admin="section.isAdmin"
        :is-more-activated="selectedSheet === sheet.id"
        @toggleMenu="toggleMenu($event, sheet.id)"
        @updateLink="changeLinkStatus(sheet.id, sheet.link)"
      >
        <action
          v-if="selectedSheet === sheet.id"
          :is-open-menu="selectedSheet === sheet.id"
          :section-id="section.id"
          :section-name="section.name"
          :assignee-id="section.assigneeId"
          :due-date="section.dueDate"
          :status="section.status"
          :menu-class="menuClass"
          :menu-x="menuX"
          :menu-y="menuY"
          @closeMenu="onCloseMenu"
          @loaded="onMenuLoaded"
        >
          <div class="menu-button">
            <button @click="onPreview(sheet.id)">Preview</button>
            <button @click="onExportPDF">PDF</button>
          </div>
        </action>
      </thumbnail-item>
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
