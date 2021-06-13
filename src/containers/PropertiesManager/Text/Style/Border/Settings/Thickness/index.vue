<template>
  <div class="thickness-container">
    <label class="properties-title">Thickness:</label>
    <PpCombobox
      :key="componentKey"
      :items="items"
      :nudge-width="85"
      :appended-icon="appendedIcon"
      :selected-val="selectedThickness"
      @change="onChange"
    />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
