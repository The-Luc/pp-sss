<template>
  <div class="mr-3">
    <span class="properties-title">Line Spacing:</span>
    <PpCombobox
      :key="componentKey"
      :items="items"
      :prepended-icon="prependedIcon"
      :appended-icon="appendedIcon"
      :selected-val="selectedLineSpacing"
      @change="onChange"
    />
  </div>
</template>

<script src="./script.js" />
