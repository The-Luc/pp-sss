<template>
  <v-row class="section-item" :class="dragTargetCssClass">
    <v-col>
      <DragDropIndicator custom-class-name="indicator-top" />

      <Header ref="header" :section="sectionInfo" :is-enable="isEnable" />

      <Details
        :start-sequence="startSequence"
        :section-id="section.id"
        :sheets="section.sheets"
        :drag-target="dragSheetTarget"
        @dragSheetTargetChange="onDragSheetTargetChange"
      />

      <DragDropIndicator custom-class-name="indicator-bottom" />
    </v-col>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
