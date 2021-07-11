<template>
  <div class="pp-selector-container">
    <span class="pp-selector-container-title">{{ title }}</span>
    <PpSelect
      :items="items"
      :disabled="disabled"
      :selected-val="layoutSelected"
      @change="onChangeLayout"
    />
  </div>
</template>

<script src="./script.js" />
