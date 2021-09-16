<template>
  <div class="d-flex flex-column">
    <span class="properties-title">Alignment:</span>
    <PpButtonGroup mandatory :item="selectedAlignment" @change="onChange">
      <v-btn :disabled="disabled" :value="LEFT">
        <v-icon>format_align_left</v-icon>
      </v-btn>
      <v-btn :disabled="disabled" :value="CENTER">
        <v-icon>format_align_center</v-icon>
      </v-btn>
      <v-btn :disabled="disabled" :value="RIGHT">
        <v-icon>format_align_right</v-icon>
      </v-btn>
      <v-btn v-show="showJustify" :value="JUSTIFY">
        <v-icon>format_align_justify</v-icon>
      </v-btn>
      <v-divider v-if="showJustify" vertical class="ml-3 mr-3"></v-divider>
    </PpButtonGroup>
  </div>
</template>

<script src="./script.js" />
