<template>
  <div ref="sideBarSection" class="sidebar-section">
    <div class="thumbnail-view-container">
      <SidebarThumbContainer
        v-for="section in sections"
        :key="section.id"
        :name="section.name"
        :color="section.color"
        :total-sheet="section.sheets.length"
        :is-enable="section.isAccessible"
      >
        <Thumbnail
          v-for="sheet in section.sheets"
          :key="sheet.id"
          :ref="`spread${sheet.id}`"
          :is-edit-icon-displayed="false"
          :is-link-icon-displayed="false"
          :is-sidebar="true"
          :number-page="numberPage(sheet)"
          :sheet-type="sheet.type"
          :link-type="sheet.link"
          :thumbnail-url="sheet.thumbnailUrl"
          :is-active="checkIsActive(sheet.id)"
          :is-enable="section.isAccessible"
          @click.native="onSelectSheet(sheet)"
        />
      </SidebarThumbContainer>
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
