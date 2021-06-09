<template>
  <div class="shadow-container">
    <span class="properties-title">Shadow: </span>
    <div>
      <PpSelect
        :items="options"
        :selected-val="selectedShadow"
        @change="onChange"
      />
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
