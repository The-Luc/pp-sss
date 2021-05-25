<template>
  <v-col class="col-9 section-name">
    <DragDropControl :id="'section' + sectionId" />

    <span class="dot" :style="'background-color: ' + sectionColor"></span>

    <img
      src="@/assets/icons/collapse.svg"
      data-toggle="collapse"
      alt="expand/collapse icon"
      title="expand/collapse icon"
    />

    <div class="input-container" @click="click">
      <div ref="text" class="text">
        {{ sectionNameCurrent }}
      </div>
      <input
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
