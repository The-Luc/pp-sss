<template>
  <div class="production">
    <ProcessItem name="Production">
      <MiniProcess
        class="design"
        description="Yearbook Layout & Design"
        :style="{
          marginLeft: createdPosition,
          width: createdLength,
          minWidth: createdLength
        }"
      />

      <MiniProcess
        class="approval"
        description="Proof Approval"
        :is-display-description-under="true"
        :style="{
          width: approvalLength,
          minWidth: approvalLength
        }"
      />

      <MiniProcess
        class="print-prodction"
        description="Print Production"
        :style="{
          width: printLength,
          minWidth: printLength,
          maxWidth: printLength
        }"
      />
    </ProcessItem>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped></style>
