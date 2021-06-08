<template>
  <div class="thickness-container">
    <label class="properties-title">Thickness:</label>
    <PpCombobox
      :items="items"
      :nudge-width="76"
      :appended-icon="appendedIcon"
      :selected-val="selectedThickness"
      @change="onChange"
    />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
