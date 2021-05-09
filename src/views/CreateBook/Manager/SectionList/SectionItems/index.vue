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
          <Indicator :isTop="true" />
          <Header :section="section" :releaseDate="project.releaseDate" />
          <Details
            :sheets="section.sheets"
            :sectionId="section.id"
            :startSeq="getStartSeq(index)"
          />
          <Indicator />
        </v-col>
      </v-row>
    </draggable>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
