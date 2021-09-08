<template>
  <group-item name="Direction">
    <pp-select
      :items="directions"
      :selected-val="direction"
      :disabled="disabled"
      @change="onDirectionChange"
    >
    </pp-select>
  </group-item>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
