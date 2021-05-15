<template>
  <v-row
    class="section-detail-container"
    data-toggle="collapse"
    :data-id="sectionId"
  >
    <v-col class="section-details-wrapper">
      <Draggable
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
          :sequence="startSequence + index"
          :section-id="sectionId"
          :sheet="sheet"
        ></Sheet>
      </Draggable>

      <Draggable
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
          :section-id="sectionId"
          :sheet="getVirtualSheet()"
        ></Sheet>
      </Draggable>
    </v-col>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
