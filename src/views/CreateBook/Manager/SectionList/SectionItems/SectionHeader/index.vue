<template>
  <v-row>
    <v-col
      class="section-header"
      v-on:click="toggleDetail"
      data-toggle="collapse"
      :data-target="section.id"
    >
      <v-row>
        <SectionName
          :sectionId="section.id"
          :sectionName="section.name"
          :sectionColor="section.color"
        />
        <SectionProcess :color="section.color" :releaseDate="releaseDate" />
      </v-row>
    </v-col>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss">
@import './style.scss';
</style>
