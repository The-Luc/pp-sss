<template>
  <div class="sidebar-section">
    <div class="digital-thumbnail-container">
      <SidebarThumbContainer
        v-for="(section, sectionIndex) in sections"
        :key="section.id"
        :name="section.name"
        :color="section.color"
        :total-sheet="section.sheets.length"
        :is-enable="true"
      >
        <Thumbnail
          v-for="(sheet, sheetIndex) in section.sheets"
          :key="sheet.id"
          :ref="`screen${sheet.id}`"
          :sheet="sheet"
          :edit="false"
          :order-screen="orderScreen(sectionIndex, sheetIndex)"
          :is-active="checkIsActive(sheet.id)"
          @click.native="onSelectSheet(sheet)"
        />
      </SidebarThumbContainer>
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
