<template>
  <group-item name="Duration">
    <pp-input
      :key="componentKey"
      decimal
      suffix=" s"
      type="text"
      :value="selectedDuration"
      :disabled="disabled"
      @change="onDurationChange"
    >
    </pp-input>
  </group-item>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
