<template>
  <v-text-field
    :key="componentKey"
    class="pp-number"
    :class="valueLength < 3 ? `length-${valueLength}` : 'length-3'"
    hide-details
    single-line
    :value="value"
    type="number"
    :suffix="suffix"
    @keydown.esc="onEsc"
    @input="onNumberChange"
    @change="onChangeInput"
  />
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
