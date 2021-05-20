<template>
  <div class="font-container">
    <v-row>
      <v-col class="col-7">
        <span class="properties-title">Font Family:</span>
        <PpSelect :items="fontFamily" />
      </v-col>
      <v-col class="col-1">
        &nbsp;
      </v-col>
      <v-col class="col-4">
        <span class="properties-title">Font Size:</span>
        <PpSelect :items="fontSize" />
      </v-col>
    </v-row>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
