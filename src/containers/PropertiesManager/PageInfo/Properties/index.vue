<template>
  <div class="page-number-properties" :class="{ disabled }">
    <div class="properties-font-family">
      <span class="properties-title">Font Family:</span>
      <PpSelect
        :disabled="disabled"
        :items="fontFamily"
        :selected-val="disabled ? {} : selectedFontFamily"
        @change="onChangeFontFamily"
      />
    </div>
    <div class="font-size-container">
      <span class="properties-title">Font Size:</span>
      <PpCombobox
        :disabled="disabled"
        :items="fontSize"
        :nudge-width="75"
        :selected-val="disabled ? { name: '', value: '' } : selectedFontSize"
        :prepended-icon="prependedIcon"
        :appended-icon="appendedIcon"
        @change="onChangeFontSize"
      />
    </div>
    <ColorPicker
      :color="disabled ? '#FFFFFF' : pageInfo.color"
      :show-eye-dropper="false"
      @change="onChangeColor"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
