<template>
  <v-row>
    <v-col
      class="section-header"
      data-toggle="collapse"
      :data-fixed="section.fixed"
      :data-target="section.id"
      v-on:click="toggleDetail"
      v-on:mouseover="showDragControl"
      v-on:mouseleave="hideDragControl"
    >
      <v-row>
        <SectionName
          :sectionId="section.id"
          :sectionName="section.name"
          :sectionColor="section.color"
        />
        <SectionProcess
          :sectionId="section.id"
          :color="section.color"
          :releaseDate="releaseDate"
        />
      </v-row>
    </v-col>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
