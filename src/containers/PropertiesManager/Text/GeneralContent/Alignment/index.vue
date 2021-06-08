<template>
  <div class="d-flex flex-column">
    <span class="properties-title">Alignment:</span>
    <PpButtonGroup mandatory :item="selectedAlignment" @change="onChange">
      <v-btn :value="LEFT">
        <v-icon>format_align_left</v-icon>
      </v-btn>
      <v-btn :value="CENTER">
        <v-icon>format_align_center</v-icon>
      </v-btn>
      <v-btn :value="RIGHT">
        <v-icon>format_align_right</v-icon>
      </v-btn>
      <v-btn :value="JUSTIFY">
        <v-icon>format_align_justify</v-icon>
      </v-btn>
      <v-divider vertical class="ml-3 mr-3"></v-divider>
    </PpButtonGroup>
  </div>
</template>
<script src="./script.js" />

<style lang="scss" src="./style.scss" />
