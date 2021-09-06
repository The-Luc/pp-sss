<template>
  <group-item name="Direction">
    <pp-select
      id="direction"
      :items="directions"
      :selected-val="selectedDirection"
      container="#direction"
      @change="onChangeDirection"
    >
    </pp-select>
  </group-item>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
