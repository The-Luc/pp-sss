<template>
  <div class="text-case-container">
    <span class="properties-title">Text Case:</span>
    <PpButtonGroup :item="item" @change="onChange">
      <v-btn>
        <img :src="upperCase" alt="uppercase" />
      </v-btn>

      <v-btn>
        <img :src="lowerCase" alt="lowerCase" />
      </v-btn>

      <v-btn>
        <img :src="capitalize" alt="capitalize" />
      </v-btn>
    </PpButtonGroup>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
