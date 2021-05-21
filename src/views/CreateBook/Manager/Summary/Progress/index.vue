<template>
  <v-row class="summary-detail">
    <v-col>
      <div class="text-700 group-title">Progress</div>

      <div class="group-detail progress">
        <div class="cover" @click="openChart">
          <div>
            Click to view latest Progress
          </div>
        </div>
        <img src="@/assets/image/chart.png" alt="chart" />
      </div>
    </v-col>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
