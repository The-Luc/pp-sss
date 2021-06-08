<template>
  <v-text-field
    :key="componentKey"
    class="pp-number"
    hide-details
    single-line
    :value="value"
    type="number"
    :suffix="suffix"
    @keydown.esc="onEsc"
    @change="onChangeInput"
  />
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
