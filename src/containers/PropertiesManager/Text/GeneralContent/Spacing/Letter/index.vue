<template>
  <div class="mr-3">
    <span class="properties-title">Letter Spacing:</span>
    <PpCombobox
      :items="items"
      :prepended-icon="prependedIcon"
      :appended-icon="appendedIcon"
      :selected-val="selectedLetterSpacing"
      @change="onChange"
    />
  </div>
</template>

<script src="./script.js" />
