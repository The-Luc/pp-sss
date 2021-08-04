<template>
  <div class="pp-selector-container">
    <PpSelect
      id="photo-type"
      :is-arrow-multi="true"
      :items="items"
      :selected-val="selectedVal"
      container="#photo-type"
      @change="onChange"
    >
    </PpSelect>
  </div>
</template>

<script src="./script.js" />
