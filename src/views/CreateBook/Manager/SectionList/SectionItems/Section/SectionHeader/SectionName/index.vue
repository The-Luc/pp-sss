<template>
  <v-col class="col-9 section-name">
    <DragDropControl :class="!isDragControlDisplayed && 'invisible'" />

    <span class="dot" :style="'background-color: ' + sectionColor"></span>

    <v-icon :class="!isEnable && 'disabled'" data-toggle="collapse">
      arrow_right
    </v-icon>

    <div ref="input-container" class="input-container" @click="click">
      <div v-show="!isEditMode" ref="text" class="text">
        {{ sectionNameCurrent }}
      </div>

      <input
        v-if="isEnable"
        v-show="isEditMode"
        ref="input"
        v-model="sectionNameCurrent"
        type="text"
        maxlength="50"
        @click.stop
        @keyup.enter="keyUpEnter"
        @keyup.esc="keyUpEsc"
        @blur="saveTitle"
      />
    </div>
  </v-col>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
