<template>
  <div class="text-case-container">
    <span class="properties-title">Text Case:</span>
    <PpButtonGroup :item="selectedCase" @change="onChange">
      <v-btn :value="UPPER">
        <img :src="iconUpperCase" alt="uppercase" />
      </v-btn>
      <v-btn :value="LOWER">
        <img :src="iconLowerCase" alt="lowerCase" />
      </v-btn>
      <v-btn :value="CAPITALIZE">
        <img :src="iconCapitalize" alt="capitalize" />
      </v-btn>
    </PpButtonGroup>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
