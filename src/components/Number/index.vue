<template>
  <v-text-field
    :key="componentKey"
    :disabled="disabled"
    class="pp-number"
    :class="`length-${valueLength > 3 ? 3 : valueLength}`"
    hide-details
    single-line
    :value="roundVal"
    :type="type"
    :suffix="suffix"
    @keydown.esc="onEsc"
    @input="onNumberChange"
    @change="onChangeInput"
  />
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
