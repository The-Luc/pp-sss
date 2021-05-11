<template>
  <v-row
    class="section-detail-container"
    data-toggle="collapse"
    :data-id="sectionId"
  >
    <v-col class="section-details-wrapper">
      <draggable
        v-model="sheets"
        v-bind="dragOptions"
        class="section-details"
        group="sheet"
        :move="onMove"
        @start="drag = true"
        @end="drag = false"
      >
        <transition-group type="transition" :name="!drag ? 'flip-list' : null">
          <div
            v-for="(sheet, index) in sheets"
            :key="sheet.id"
            class="sheet-box"
          >
            <v-row>
              <v-col
                :class="sheet.type == 'half' ? 'vertical' : 'horizontal'"
              ></v-col>
            </v-row>

            <v-row>
              <v-col class="sheet-name"
                >{{ startSeq + index }}{{ sheet.name }}</v-col
              >
            </v-row>
          </div>
        </transition-group>
      </draggable>
    </v-col>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss">
@import './style.scss';
</style>
