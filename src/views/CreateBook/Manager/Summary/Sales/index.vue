<template>
  <v-row class="summary-detail">
    <v-col>
      <div class="text-700 group-title">Sales</div>
      <div class="group-detail">
        <div class="info-name">Books Sold:</div>
        <div class="info-detail">{{ book.booksSold }}</div>
      </div>
      <div class="group-detail">
        <div class="info-name">Fundraising $ Earned:</div>
        <div class="info-detail">${{ fundraisingEarned }}</div>
      </div>
    </v-col>
  </v-row>
</template>

<script src="./script.js"></script>
