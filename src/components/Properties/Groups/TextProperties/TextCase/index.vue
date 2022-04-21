<template>
  <div class="text-case-container">
    <span class="properties-title">Text Case:</span>
    <PpButtonGroup :item="selectedCase" @change="onChange">
      <v-btn :disabled="disabled" :value="UPPER">
        <img :src="iconUpperCase" alt="uppercase" />
      </v-btn>
      <v-btn :disabled="disabled" :value="LOWER">
        <img :src="iconLowerCase" alt="lowerCase" />
      </v-btn>
      <v-btn :disabled="disabled" :value="CAPITALIZE">
        <img :src="iconCapitalize" alt="capitalize" />
      </v-btn>
    </PpButtonGroup>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
