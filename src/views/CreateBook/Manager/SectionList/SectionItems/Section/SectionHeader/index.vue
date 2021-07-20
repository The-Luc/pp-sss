<template>
  <v-row>
    <v-col
      :id="`section-${section.id}`"
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
          :is-enable="isEnable"
        />
        <SectionProcess :section="section" :is-enable="isEnable" />
      </v-row>
    </v-col>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
