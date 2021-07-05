<template>
  <div class="row thumbnail-view-row">
    <template v-for="section in sections">
      <Frames
        v-for="sheet in section.sheets"
        :key="sheet.id"
        :section="section"
      >
        <Thumbnail
          :to-link="`/book/${bookId}/edit/print/edit-screen`"
          :number-page="numberPage(sheet)"
          :sheet="sheet"
          @click.native="onSelectSheet(sheet, section.id)"
          @change="changeLinkStatus(sheet.id, sheet.link)"
        />
      </Frames>
    </template>
  </div>
</template>
<script src="./script.js" />
<style lang="scss" scoped src="./style.scss" />
