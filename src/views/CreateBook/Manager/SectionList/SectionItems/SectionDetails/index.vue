<template>
  <v-row
    class="section-detail-container"
    data-toggle="collapse"
    :data-id="sectionId"
  >
    <v-col class="section-details-wrapper">
      <draggable
        v-if="sheets.length > 0"
        v-model="sheets"
        class="row section-details"
        :data-section="sectionId"
        group="sheet"
        :move="onMove"
        @choose="onChoose"
        @start="drag = true"
        @end="onEnd"
      >
        <Sheet
          v-for="(sheet, index) in sheets"
          :key="sheet.id"
          :sequence="startSeq + index"
          :sheet-id="sheet.id"
          :sheet-type="sheet.type"
          :sheet-draggable="sheet.draggable"
          :section-id="sectionId"
        ></Sheet>
      </draggable>

      <draggable
        v-else
        v-model="sheets"
        class="row section-details"
        :data-section="sectionId"
        group="sheet"
        :move="onMove"
        @choose="onChoose"
        @start="drag = true"
        @end="onEnd"
      >
        <Sheet
          :sequence="-1"
          :sheet-id="-sectionId"
          sheet-type="full"
          :draggable="false"
        ></Sheet>
      </draggable>
    </v-col>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
