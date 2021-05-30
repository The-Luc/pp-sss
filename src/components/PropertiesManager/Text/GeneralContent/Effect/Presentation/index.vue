<template>
  <div class="presentation-container">
    <span class="properties-title">Presentation:</span>
    <PpButtonGroup :item="item" multiple @change="onChange">
      <v-btn @click.native="isBold">
        <v-icon>format_bold</v-icon>
      </v-btn>
      <v-btn @click.native="isItalic">
        <v-icon>format_italic</v-icon>
      </v-btn>
      <v-btn @click.native="isUnderLine">
        <v-icon>format_underlined</v-icon>
      </v-btn>
    </PpButtonGroup>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
