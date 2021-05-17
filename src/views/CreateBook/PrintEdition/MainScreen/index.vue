<template>
  <div class="row thumbnail-view-row">
    <template v-for="section in book.sections">
      <Frames
        v-for="sheet in section.sheets"
        :key="sheet.id"
        :section="section"
      >
        <Thumbnail
          to-link="/edit/print/edit-screen"
          :number-page="numberPage(section.id, sheet)"
          :sheet="sheet"
        />
      </Frames>
    </template>
  </div>
</template>
<script src="./script.js" />
<style lang="scss" scoped src="./style.scss" />
