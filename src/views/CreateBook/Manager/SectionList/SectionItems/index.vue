<template>
  <v-row>
    <draggable
      class="col"
      v-model="project.sections"
      :move="onMove"
      @start="drag = true"
      @end="drag = false"
    >
      <v-row
        v-for="(section, index) in project.sections"
        :key="section.id"
        class="section-item"
      >
        <v-col>
          <Header :section="section" :releaseDate="project.releaseDate" />
          <Details
            :sheets="section.sheets"
            :sectionId="section.id"
            :startSeq="getStartSeq({ index })"
          />
        </v-col>
      </v-row>
    </draggable>
  </v-row>
</template>

<script src="./script.js"></script>
