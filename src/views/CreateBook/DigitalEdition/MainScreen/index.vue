<template>
  <div class="row thumbnail-view-row">
    <template v-for="section in book.sections">
      <Frames
        v-for="sheet in section.sheets"
        :key="sheet.id"
        :section="section"
      >
        <Thumbnail
          :to-link="`/book/${bookId}/edit/digital/edit-screen`"
          :sheet="sheet"
          font-size="11px"
          main-screen
          :order-screen="orderScreen(section.id, sheet)"
          @click.native="onSelectScreen(sheet.id)"
        />
      </Frames>
    </template>
  </div>
</template>
<script src="./script.js" />
<style lang="scss" scoped src="./style.scss" />
