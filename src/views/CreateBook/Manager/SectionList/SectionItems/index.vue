<template>
  <v-row>
    <draggable
      class="col"
      v-model="sections"
      :move="onMove"
      @start="drag = true"
      @end="drag = false"
    >
      <v-row
        v-for="(section, index) in sections"
        :key="section.id"
        class="section-item"
      >
        <v-col>
          <Header
            :section-id="section.id"
            :section-name="section.name"
            :section-color="section.color"
            :section-release-date="section.releaseDate"
          />
          <Details
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
