<template>
  <div class="sheet-box">
    <v-row>
      <v-col :class="sheetType == 'half' ? 'vertical' : 'horizontal'"></v-col>
    </v-row>

    <v-row>
      <v-col class="sheet-name"> {{ sequence }}{{ sheetId }} </v-col>
    </v-row>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
