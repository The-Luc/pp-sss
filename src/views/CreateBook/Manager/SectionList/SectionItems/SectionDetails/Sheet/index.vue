<template>
  <v-col class="sheet-box">
    <v-row>
      <DragDropIndicator
        :id="'sheet-left-' + sheetId"
        custom-class-name="indicator-left"
      />

      <v-col :class="sheetId < 0 ? 'hide' : ''">
        <v-row>
          <v-col
            :class="['sheet', sheetType == 'half' ? 'vertical' : 'horizontal']"
            :data-draggable="draggable"
            @mouseover="showDragControl"
            @mouseleave="hideDragControl"
          >
            <DragDropControl :id="'sheet' + sheetId" />
          </v-col>
        </v-row>

        <v-row>
          <v-col class="sheet-name"> {{ sequence }}{{ sheetId }} </v-col>
        </v-row>
      </v-col>

      <DragDropIndicator
        :id="'sheet-right-' + sheetId"
        custom-class-name="indicator-right"
      />
    </v-row>
  </v-col>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
