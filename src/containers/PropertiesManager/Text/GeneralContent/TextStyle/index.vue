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
    <SavedTextStylePopover
      v-if="showSavedStylePopup"
      v-click-outside="onClickOutside"
      :items="selectBoxItems"
      :selected-val="selectedItem"
      @change="onChange"
    />
  </div>
</template>

<script src="./script.js" />

<style scopped lang="scss" src="./style.scss" />
