<template>
  <div class="page-number-properties">
    <div class="properties-font-family">
      <span class="properties-title">Font Family:</span>
      <PpSelect
        :items="fontFamily"
        :selected-val="selectedFontFamily"
        @change="onChangeFontFamily"
      />
    </div>
    <div class="font-size-container">
      <span class="properties-title">Font Size:</span>
      <PpCombobox
        :items="fontSize"
        :nudge-width="75"
        :selected-val="selectedFontSize"
        :prepended-icon="prependedIcon"
        :appended-icon="appendedIcon"
        @change="onChangeFontSize"
      />
    </div>
    <ColorPicker
      :color="pageInfo.color"
      :colorize="false"
      @change="onChangeColor"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
