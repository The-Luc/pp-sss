<template>
  <div>
    <span class="properties-title">Font Family:</span>
    <PpSelect
      :selected-val="selectedFont"
      :items="fontFamily"
      @change="onChange"
    />
  </div>
</template>

<script src="./script.js" />
