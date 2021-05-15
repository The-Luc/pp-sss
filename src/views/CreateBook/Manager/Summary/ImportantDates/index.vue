<template>
  <v-row class="summary-detail">
    <v-col>
      <div class="text-700 group-title">Important Dates</div>

      <div class="group-detail">
        <div class="info-name">Requested Delivery Date:</div>
        <div class="info-detail">{{deliveryDate}}</div>
      </div>

      <div class="group-detail">
        <div class="info-name">File Release Due Date:</div>
        <div class="info-detail">{{dueDate}}</div>
      </div>

      <div class="group-detail">
        <div class="info-name">Countdown:</div>
        <div class="info-detail countdown">{{countdown}} days remaining</div>
      </div>
    </v-col>
  </v-row>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss"></style>
