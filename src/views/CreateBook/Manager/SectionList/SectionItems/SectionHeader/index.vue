<template>
  <v-row>
    <v-col
      :id="`section-${section.id}`"
      class="section-header"
      data-toggle="collapse"
      :data-target="section.id"
      v-on:click="toggleDetail"
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

<style lang="scss">
@import './style.scss';
</style>
