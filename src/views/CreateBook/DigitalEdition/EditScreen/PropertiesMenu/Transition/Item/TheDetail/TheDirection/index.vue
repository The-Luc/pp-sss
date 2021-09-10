<template>
  <group-item name="Direction" :disabled="disabled">
    <pp-select
      data-container="transition-properties"
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
