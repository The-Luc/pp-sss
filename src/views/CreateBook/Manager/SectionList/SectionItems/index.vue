<template>
  <v-row>
    <Draggable
      v-model="sections"
      class="col"
      :disabled="!isEnable"
      :move="onMove"
      @choose="onChoose"
      @start="drag = true"
      @unchoose="onUnchoose"
      @end="onEnd"
    >
      <Section
        v-for="(section, index) in sections"
        :ref="`section-${section.id}`"
        :key="section.id"
        :start-sequence="getStartSeq(index)"
        :section="section"
        :is-enable="isEnable"
        :drag-target-type="getDragTargetType(section)"
        :drag-sheet-target="dragSheetTarget"
        @dragSheetTargetChange="onDragSheetTargetChange"
      />
    </Draggable>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
