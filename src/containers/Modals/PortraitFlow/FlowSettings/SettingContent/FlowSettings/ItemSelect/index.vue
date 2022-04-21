<template>
  <div class="page-select-item " :class="{ 'item-disabled': disabled }">
    <div class="page-select-item-title">{{ title }}</div>
    <div class="page-select-item-descript">
      {{ descript }}
    </div>
    <pp-select
      :disabled="disabled"
      :selected-val="selectedVal"
      :items="items"
      @change="onChange"
    ></pp-select>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
