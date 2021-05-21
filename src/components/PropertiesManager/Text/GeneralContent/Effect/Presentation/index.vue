<template>
  <div class="presentation-container">
    <span class="properties-title">Presentation:</span>
    <PpButtonGroup v-model="currentItem" :current-item-active="currentItem">
      <v-btn>
        <v-icon>format_bold</v-icon>
      </v-btn>

      <v-btn>
        <v-icon>format_italic</v-icon>
      </v-btn>

      <v-btn>
        <v-icon>format_underlined</v-icon>
      </v-btn>
    </PpButtonGroup>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
