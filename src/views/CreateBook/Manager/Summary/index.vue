<template>
  <v-col
    id="manager-summary"
    ref="summary"
    class="manager-summary scroll-container"
  >
    <v-row>
      <v-col class="scroll-container">
        <Header :show-toggle="true">CONTENT MAPPING SETTINGS</Header>
        <mapping-settings />

        <div class="break-line"></div>

        <Header>PROGRAM SUMMARY</Header>
        <SummaryInfo />
      </v-col>
    </v-row>
  </v-col>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
