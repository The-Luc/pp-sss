<template>
  <div class="border-container">
    <label class="properties-title">Border:</label>
    <Select
      :items="options"
      :selected-val="selectedBorder"
      @change="onChangeSelectedBorder"
    />
    <div v-if="showBorder" class="border-setting-container">
      <BorderStyle
        :selected-style="strokeLineType"
        @change="onChangeBorderStyle"
      />
      <BorderColor
        :selected-color="strokeColor"
        @change="onChangeBorderColor"
      />
      <BorderThickness
        :stroke-width="strokeWidth"
        @change="onChangeThickness"
      />
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
