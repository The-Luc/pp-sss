<template>
  <v-row>
    <draggable
      v-model="sections"
      class="col"
      :move="onMove"
      @choose="onChoose"
      @start="drag = true"
      @end="onEnd"
    >
      <v-row
        v-for="(section, index) in sections"
        :key="section.id"
        class="section-item"
      >
        <v-col>
          <DragDropIndicator
            :id="'section-top-' + section.id"
            custom-class-name="indicator-top"
          />

          <Header
            :section-id="section.id"
            :section-name="section.name"
            :section-color="section.color"
            :section-release-date="section.releaseDate"
            :section-draggable="section.draggable"
          />

          <Details
            :section-id="section.id"
            :start-seq="getStartSeq(index)"
            :sheets="getSheetsOfSection(section.id)"
          />

          <DragDropIndicator
            :id="'section-bottom-' + section.id"
            custom-class-name="indicator-bottom"
          />
        </v-col>
      </v-row>
    </draggable>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
