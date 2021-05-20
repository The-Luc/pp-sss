<template>
  <v-select
    class="pp-select"
    :items="items"
    item-text="label"
    item-value="value"
    label="Solo field"
    :value="items[0].value"
    solo
    persistent-hint
    @change="onChange"
  >
    <template #append>
      <img :src="arrowSelect" alt="arrow-select" />
    </template>
  </v-select>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
