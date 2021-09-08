<template>
  <group-item name="Transition">
    <pp-select
      :items="transitions"
      :selected-val="transition"
      @change="onTransitionChange"
    >
    </pp-select>
  </group-item>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
