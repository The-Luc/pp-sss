<template>
  <v-col id="manager-summary" ref="summary" class="manager-summary">
    <v-row>
      <v-col class="scroll-container">
        <Header />

        <v-row>
          <v-col>
            <ImportantDates />
            <Specification />
            <Sales />
            <Progress />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-col>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
