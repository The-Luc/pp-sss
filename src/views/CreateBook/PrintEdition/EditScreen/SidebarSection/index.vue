<template>
  <div class="sidebar-section">
    <div class="thumbnail-view-container">
      <HeaderContainer
        v-for="section in book.sections"
        :key="section.id"
        :section="section"
      >
        <Thumbnail
          v-for="sheet in section.sheets"
          :key="sheet.id"
          :sheet="sheet"
          :edit="false"
          :is-show-link="false"
          :number-page="numberPage(section.id, sheet)"
          :is-active="checkIsActive(sheet.id)"
          @click.native="onSelectSheet(sheet.id)"
        />
      </HeaderContainer>
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
