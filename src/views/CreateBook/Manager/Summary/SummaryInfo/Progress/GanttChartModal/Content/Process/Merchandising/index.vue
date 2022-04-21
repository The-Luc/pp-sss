<template>
  <div class="merchandising">
    <ProcessItem name="Merchandising" header-color="#9CB6C4">
      <MiniProcess
        class="pre-sale"
        description="Pre-Sale Period"
        :style="{
          marginLeft: preSalePosition,
          width: preSaleLength,
          minWidth: preSaleLength
        }"
      />

      <MiniProcess class="demand-sale" description="On-Demand Sales" />
    </ProcessItem>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped></style>
