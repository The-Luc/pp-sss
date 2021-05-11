<template>
  <v-row>
    <draggable
      v-model="project.sections"
      class="col"
      :move="onMove"
      @choose="onChoose"
      @start="drag = true"
      @end="onEnd"
    >
      <v-row
        v-for="(section, index) in project.sections"
        :key="section.id"
        class="section-item"
      >
        <v-col>
          <Indicator :is-top="true" />
          <Header :section="section" :release-date="project.releaseDate" />
          <Details
            :sheets="section.sheets"
            :section-id="section.id"
            :start-seq="getStartSeq(index)"
          />
          <Indicator />
        </v-col>
      </v-row>
    </draggable>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
