<template>
  <div class="box-margin">
    {{ label }}
    <pp-combobox
      :key="componentKey"
      :disabled="disabled"
      :items="textMargin"
      :margin-menu="0"
      :nudge-width="80"
      :selected-val="selectedVal"
      :appended-icon="appendedIcon"
      @change="onChangeMargin"
    ></pp-combobox>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
