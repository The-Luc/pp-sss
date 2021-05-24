<template>
  <v-select
    class="pp-select"
    :items="items"
    item-text="label"
    item-value="value"
    solo
    persistent-hint
    @change="onChange"
  >
    <template v-if="prependedIcon" #prepend>
      <img :src="prependedIcon" alt="prepend-icon" class="prepend-icon" />
    </template>
    <template v-if="appendedIcon" #append>
      <img :src="appendedIcon" alt="arrow-select" />
    </template>
  </v-select>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
