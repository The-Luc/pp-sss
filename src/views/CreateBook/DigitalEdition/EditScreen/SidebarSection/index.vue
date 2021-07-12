<template>
  <div class="sidebar-section">
    <div class="digital-thumbnail-container">
      <HeaderContainer
        v-for="section in book.sections"
        :key="section.id"
        :section="section"
      >
        <Thumbnail
          v-for="sheet in section.sheets"
          :key="sheet.id"
          :ref="`screen${sheet.id}`"
          :sheet="sheet"
          :edit="false"
          :order-screen="orderScreen(section.id, sheet)"
          :is-active="checkIsActive(sheet.id)"
          @click.native="onSelectSheet(sheet)"
        />
      </HeaderContainer>
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
