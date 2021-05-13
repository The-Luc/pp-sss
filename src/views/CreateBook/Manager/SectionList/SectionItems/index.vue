<template>
  <v-row>
    <draggable
      v-model="book.sections"
      class="col"
      :move="onMove"
      @start="drag = true"
      @end="drag = false"
    >
      <v-row
        v-for="(section, index) in book.sections"
        :key="section.id"
        class="section-item"
      >
        <v-col>
          <Header :section="section" />
          <Details
            :sheets="section.sheets"
            :section-id="section.id"
            :start-seq="getStartSeq({ index })"
          />
        </v-col>
      </v-row>
    </draggable>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
