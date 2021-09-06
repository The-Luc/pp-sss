<template>
  <group-item name="Transition">
    <pp-select
      id="transition-type"
      :items="transitions"
      :selected-val="selectedTransition"
      container="#transition-type"
      @change="onChangeTransition"
    >
    </pp-select>
  </group-item>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
