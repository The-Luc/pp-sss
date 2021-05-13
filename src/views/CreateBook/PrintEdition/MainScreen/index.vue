<template>
  <div class="row">
    <div class="row col-12 thumbnail-view-row">
      <template v-for="section in project.sections">
        <Frames
          v-for="sheet in section.sheets"
          :section="section"
          :key="sheet.id"
        >
          <Thumbnail :sheet="sheet"/>
        </Frames>
      </template>
    </div>
  </div>
</template>
<script src="./script.js" />
<style lang="scss" scoped src="./style.scss" />
