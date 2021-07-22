<template>
  <div ref="sideBarSection" class="sidebar-section">
    <div class="thumbnail-view-container">
      <SidebarThumbContainer
        v-for="section in sections"
        :key="section.id"
        :section="section"
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
          @click.native="onSelectSheet(sheet, section.id)"
        />
      </SidebarThumbContainer>
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
