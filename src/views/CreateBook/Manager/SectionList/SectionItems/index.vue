<template>
  <v-row>
    <draggable
      v-model="book.sections"
      class="col"
      :move="onMove"
      @choose="onChoose"
      @start="drag = true"
      @end="onEnd"
    >
      <v-row
        v-for="(section, index) in book.sections"
        :key="section.id"
        class="section-item"
      >
        <v-col>
          <DragDropIndicator
            :id="'section-top-' + section.id"
            custom-class-name="indicator-top"
          />
          <Header :section="section" :release-date="book.releaseDate" />
          <Details
            :sheets="section.sheets"
            :section-id="section.id"
            :start-seq="getStartSeq(index)"
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
