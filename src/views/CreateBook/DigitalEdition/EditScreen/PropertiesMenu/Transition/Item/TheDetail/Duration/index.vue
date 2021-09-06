<template>
  <group-item name="Duration">
    <pp-input
      suffix=" s"
      :value="selectedDuration"
      type="text"
      @change="onChangeDuration"
    >
    </pp-input>
  </group-item>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
