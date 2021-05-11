<template>
  <div class="row">
    <div class="row col-12 thumbnail-view-row">
      <template v-for="section in project.sections">
        <ThumbnailView v-for="sheet in section.sheets" :sheet="sheet" :section="section" :key="sheet.id"/>
      </template>
    </div>
  </div>
</template>
<script src="./script.js" />
<style lang="scss" scoped src="./style.scss" />
