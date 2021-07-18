<template>
  <div class="row thumbnail-view-row">
    <template v-for="(section, sectionIndex) in sections">
      <Frames
        v-for="(sheet, sheetIndex) in section.sheets"
        :key="sheet.id"
        :section="section"
      >
        <Thumbnail
          :to-link="`/book/${bookId}/edit/digital/edit-screen`"
          :sheet="sheet"
          :order-screen="orderScreen(sectionIndex, sheetIndex)"
          @click.native="onSelectScreen(sheet)"
        />
      </Frames>
    </template>
  </div>
</template>
<script src="./script.js" />
<style lang="scss" scoped src="./style.scss" />
