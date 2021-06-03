<template>
  <div class="d-flex flex-column">
    <span class="properties-title">Alignment:</span>
    <PpButtonGroup :item="item" @change="onChange">
      <v-btn>
        <v-icon>format_align_left</v-icon>
      </v-btn>
      <v-btn>
        <v-icon>format_align_center</v-icon>
      </v-btn>
      <v-btn>
        <v-icon>format_align_right</v-icon>
      </v-btn>
      <v-btn>
        <v-icon>format_align_justify</v-icon>
      </v-btn>
      <v-divider vertical class="ml-3 mr-3"></v-divider>
    </PpButtonGroup>
  </div>
</template>
<script src="./script.js" />

<style lang="scss" src="./style.scss" />
