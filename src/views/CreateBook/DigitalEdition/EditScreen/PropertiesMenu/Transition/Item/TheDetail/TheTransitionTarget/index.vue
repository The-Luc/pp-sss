<template>
  <group-item :is-name-displayed="false">
    <pp-select
      id="target-type"
      container="#target-type"
      :items="targets"
      :selected-val="defaultValue"
      @change="onTargetChange"
    >
    </pp-select>
  </group-item>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
