<template>
  <v-col id="manager-section-list" class="manager-section-list">
    <v-row>
      <v-col id="scroll-section" class="scroll-container">
        <Items ref="sections" />
        <Control />
      </v-col>
    </v-row>
  </v-col>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
