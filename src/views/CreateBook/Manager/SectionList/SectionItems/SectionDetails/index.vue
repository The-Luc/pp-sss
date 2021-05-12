<template>
  <v-row
    class="section-detail-container"
    data-toggle="collapse"
    :data-id="sectionId"
  >
    <v-col class="section-details-wrapper">
      <draggable
        v-model="sheets"
        class="section-details"
        group="sheet"
        :move="onMove"
        @start="drag = true"
        @end="drag = false"
      >
        <Sheet
          v-for="(sheet, index) in sheets"
          :key="sheet.id"
          :sequence="startSeq + index"
          :sheet-id="sheet.id"
          :sheet-type="sheet.type"
        ></Sheet>
      </draggable>
    </v-col>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
