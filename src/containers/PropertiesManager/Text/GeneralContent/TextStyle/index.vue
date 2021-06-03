<template lang="">
  <div class="text-style-container">
    <span class="properties-title">Text Style:</span>
    <PpSelect
      :items="selectBoxItems"
      :selected-val="selectedItem"
      @change="onChange"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
