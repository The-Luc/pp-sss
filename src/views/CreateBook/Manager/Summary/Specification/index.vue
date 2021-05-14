<template>
  <v-row class="summary-detail">
    <v-col>
      <div class="text-700 group-title">Specification</div>

      <div class="group-detail">
        <div class="info-name">Cover Option:</div>
        <div class="info-detail">{{ coverOption }}</div>
      </div>

      <div class="group-detail">
        <div class="info-name">Number of Pages (maximum):</div>
        <div class="info-detail">{{ numberMaxPages }}</div>
      </div>

      <div class="group-detail">
        <div class="info-name">Estimated Quantity:</div>
        <div class="info-detail">{{ minEstimated }} - {{ maxEstimated }}</div>
      </div>

      <div class="group-detail">
        <div class="info-name">Delivery Option:</div>
        <div class="info-detail">{{ deliveryOption }}</div>
      </div>
    </v-col>
  </v-row>
</template>

<script src="./script.js"></script>
