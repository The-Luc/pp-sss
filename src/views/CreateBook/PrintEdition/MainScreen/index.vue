<template>
  <div class="row">
    <div class="row col-12 thumbnail-view-row">
      <template v-for="section in book.sections">
        <Frames
          v-for="sheet in section.sheets"
          :key="sheet.id"
          :section="section"
        >
          <Thumbnail :sheet="sheet" />
        </Frames>
      </template>
    </div>
  </div>
</template>
<script src="./script.js" />
<style lang="scss" scoped src="./style.scss" />
