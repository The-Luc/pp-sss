<template>
  <div class="col-2 sidebar-section">
    <div class="thumbnail-view-container">
      <HeaderContainer v-for="section in book.sections" :key="section.id" :section="section">
        <Thumbnail
          v-for="sheet in section.sheets"
          :key="sheet.id"
          :sheet="sheet"
          :edit="false"
          :link="false"
        />
      </HeaderContainer>
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
