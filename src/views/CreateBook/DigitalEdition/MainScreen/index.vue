<template>
  <div class="row thumbnail-view-row">
    <template v-for="(section, sectionIndex) in sections">
      <ListThumbContainer
        v-for="(sheet, sheetIndex) in section.sheets"
        :key="sheet.id"
        :section="section"
      >
        <Thumbnail
          :to-link="`/book/${bookId}/edit/digital/edit-screen/${sheet.id}`"
          :sheet="sheet"
          :order-screen="orderScreen(sectionIndex, sheetIndex)"
        />
      </ListThumbContainer>
    </template>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
