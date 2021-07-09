<template>
  <div class="border-container">
    <label class="properties-title">Border:</label>
    <Select
      :items="options"
      :selected-val="selectedBorder"
      @change="onChangeSelectedBorder"
    />
    <div
      v-if="selectedBorder.value === 'line'"
      class="border-setting-container"
    >
      <BorderStyle @change="onChangeBorderStyle" />
      <BorderColor />
      <BorderThickness @change="onChangeThickness" />
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
