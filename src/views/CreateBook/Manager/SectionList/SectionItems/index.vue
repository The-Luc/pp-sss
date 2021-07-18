<template>
  <v-row>
    <Draggable
      v-model="sections"
      class="col"
      :move="onMove"
      @choose="onChoose"
      @start="drag = true"
      @end="onEnd"
    >
      <Section
        v-for="(section, index) in sections"
        :key="section.id"
        :start-sequence="getStartSeq(index)"
        :section="section"
      ></Section>
    </Draggable>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
