<template>
  <group-item name="Transition">
    <pp-select
      data-container="transition-properties"
      :items="transitions"
      :selected-val="transition"
      @change="onTransitionChange"
    >
    </pp-select>
  </group-item>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
