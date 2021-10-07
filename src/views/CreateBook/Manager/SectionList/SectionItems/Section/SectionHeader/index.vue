<template>
  <v-row>
    <v-col
      :id="`section-${section.id}`"
      class="section-header"
      :class="!isEnable && 'disabled'"
      data-toggle="collapse"
      :data-target="section.id"
      @click="toggleDetail"
      @mouseover="showDragControl"
      @mouseleave="hideDragControl"
    >
      <v-row>
        <SectionName
          ref="name"
          :section-id="section.id"
          :section-name="section.name"
          :section-color="section.color"
          :is-enable="isEnable"
          :is-drag-control-displayed="isDragControlDisplayed"
        />
        <SectionProcess :section="section" />
      </v-row>
    </v-col>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
