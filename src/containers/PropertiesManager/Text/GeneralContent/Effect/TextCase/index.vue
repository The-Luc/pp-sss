<template>
  <div class="text-case-container">
    <span class="properties-title">Text Case:</span>
    <PpButtonGroup pp-active-class="not-active">
      <v-btn @click.native="upperCase">
        <img :src="iconUpperCase" alt="uppercase" />
      </v-btn>
      <v-btn @click.native="lowerCase">
        <img :src="iconLowerCase" alt="lowerCase" />
      </v-btn>
      <v-btn @click.native="capitalize">
        <img :src="iconCapitalize" alt="capitalize" />
      </v-btn>
    </PpButtonGroup>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
