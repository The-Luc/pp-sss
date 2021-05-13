<template>
  <v-row>
    <v-col
      class="section-header"
      data-toggle="collapse"
      :data-target="section.id"
      @click="toggleDetail"
    >
      <v-row>
        <SectionName
          :section-id="section.id"
          :section-name="section.name"
          :section-color="section.color"
        />
        <SectionProcess
          :section-id="section.id"
          :color="section.color"
          :release-date="releaseDate"
        />
      </v-row>
    </v-col>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
