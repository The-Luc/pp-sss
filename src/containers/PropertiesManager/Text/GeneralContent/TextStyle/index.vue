<template lang="">
  <div class="text-style-container">
    <span class="properties-title">Text Style:</span>
    <PpSelect
      :key="componentKey"
      :items="selectBoxItems"
      :selected-val="selectedItem"
      @change="onChange"
      @click="onClick"
    />
    <SavedStylePopover
      v-show="showSavedStylePopup"
      :items="selectBoxItems"
      :selected-val="selectedItem"
      @change="onChange"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
