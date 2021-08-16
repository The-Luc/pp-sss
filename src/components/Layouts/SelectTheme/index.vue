<template>
  <div class="pp-selector-container">
    <span class="pp-selector-container-title">Theme:</span>
    <PpSelect
      :items="items"
      :selected-val="themeSelected"
      :disabled="disabled"
      @change="onChangeTheme"
    />
  </div>
</template>

<script src="./script.js" />
