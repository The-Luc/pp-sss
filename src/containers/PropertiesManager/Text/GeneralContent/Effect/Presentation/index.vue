<template>
  <div class="presentation-container">
    <span class="properties-title">Presentation:</span>
    <PpButtonGroup :item="selectedStyles" multiple @change="onChange">
      <v-btn :value="BOLD">
        <v-icon>format_bold</v-icon>
      </v-btn>
      <v-btn :value="ITALIC">
        <v-icon>format_italic</v-icon>
      </v-btn>
      <v-btn :value="UNDERLINE">
        <v-icon>format_underlined</v-icon>
      </v-btn>
    </PpButtonGroup>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
