<template>
  <div class="d-flex flex-column">
    <span class="properties-title mb-5" />
    <PpButtonGroup mandatory :item="selectedAlignment" @change="onChange">
      <v-btn :value="TOP">
        <v-icon>vertical_align_top</v-icon>
      </v-btn>

      <v-btn :value="MIDDLE">
        <v-icon>vertical_align_center</v-icon>
      </v-btn>

      <v-btn :value="BOTTOM">
        <v-icon>vertical_align_bottom</v-icon>
      </v-btn>
    </PpButtonGroup>
  </div>
</template>

<script src="./script.js" />
