<template>
  <div class="text-case-container">
    <span class="properties-title">Text Case:</span>
    <PpButtonGroup :item="item" @change="onChange">
      <v-btn>
        <img :src="iconUpperCase" alt="uppercase" />
      </v-btn>
      <v-btn>
        <img :src="iconLowerCase" alt="lowerCase" />
      </v-btn>
      <v-btn>
        <img :src="iconCapitalize" alt="capitalize" />
      </v-btn>
    </PpButtonGroup>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
