<template>
  <div>
    <span class="properties-title">Font Family:</span>
    <PpSelect
      :disabled="disabled"
      :selected-val="selectedFont"
      :items="fontFamily"
      @change="onChange"
    />
  </div>
</template>

<script src="./script.js" />
