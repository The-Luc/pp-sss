<template>
  <v-row>
    <v-col
      class="section-header"
      data-toggle="collapse"
      :data-draggable="section.draggable"
      :data-target="section.id"
      @click="toggleDetail"
      @mouseover="showDragControl"
      @mouseleave="hideDragControl"
    >
      <v-row>
        <SectionName
          :section-id="section.id"
          :section-name="section.name"
          :section-color="section.color"
        />
        <SectionProcess
          :section-id="section.id"
          :section-color="section.color"
          :release-date="releaseDate"
        />
      </v-row>
    </v-col>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
