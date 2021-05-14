<template>
  <v-row>
    <v-col
      class="section-header"
      data-toggle="collapse"
      :data-draggable="sectionDraggable"
      :data-target="sectionId"
      @click="toggleDetail"
      @mouseover="showDragControl"
      @mouseleave="hideDragControl"
    >
      <v-row>
        <SectionName
          :section-id="sectionId"
          :section-name="sectionName"
          :section-color="sectionColor"
        />
        <SectionProcess
          :section-id="sectionId"
          :section-color="sectionColor"
          :section-release-date="sectionReleaseDate"
        />
      </v-row>
    </v-col>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
