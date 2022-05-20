<template>
  <v-row>
    <v-col class="summary-title">
      <img
        v-show="showToggle"
        src="@/assets/icons/double-arrow-right.svg"
        alt="toggle summary icon"
        @click="toogleSummary"
      />

      <span class="text-700">
        <slot></slot>
      </span>
    </v-col>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
