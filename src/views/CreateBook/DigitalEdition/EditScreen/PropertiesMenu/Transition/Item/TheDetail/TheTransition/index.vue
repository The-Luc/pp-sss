<template>
  <group-item name="Transition">
    <pp-select
      id="transition-type"
      container="#transition-type"
      :items="transitions"
      :selected-val="transition"
      @change="onTransitionChange"
    >
    </pp-select>
  </group-item>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
