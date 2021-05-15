<template>
  <v-row class="section-item">
    <v-col>
      <DragDropIndicator
        :id="'section-top-' + section.id"
        custom-class-name="indicator-top"
      />

      <Header :section="getSection()" />

      <Details
        :start-sequence="startSequence"
        :section-id="section.id"
        :sheets="section.sheets"
      />

      <DragDropIndicator
        :id="'section-bottom-' + section.id"
        custom-class-name="indicator-bottom"
      />
    </v-col>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
