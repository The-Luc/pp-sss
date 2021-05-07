<template>
  <v-row>
    <draggable
      v-model="project.sections"
      v-bind="dragOptions"
      class="col"
      :move="onMove"
      :onChange="onChange"
      :setData="setData"
      @choose="onChoose"
      @start="drag = true"
      @end="onEnd"
    >
      <transition-group type="transition" :name="!drag ? 'flip-list' : null">
        <v-row
          v-for="(section, index) in project.sections"
          :key="section.id"
          class="section-item"
        >
          <v-col>
            <v-row class="indicator">
              <v-col
                style="width: 100%; height: 2px; background-color: black;"
              ></v-col
            ></v-row>
            <Header :section="section" :releaseDate="project.releaseDate" />
            <Details
              :sheets="section.sheets"
              :sectionId="section.id"
              :startSeq="getStartSeq(index)"
            />
          </v-col>
        </v-row>
      </transition-group>
    </draggable>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>

<style>
.ghost {
  opacity: 1;
}
</style>
