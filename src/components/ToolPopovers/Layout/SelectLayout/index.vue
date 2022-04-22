<template>
  <div class="pp-selector-container">
    <span class="pp-selector-container-title">{{ title }}</span>
    <PpSelectMulti
      id="layout-type"
      :items="items"
      :disabled="disabled"
      :selected-val="layoutSelected"
      :is-use-sub-short-name="true"
      container="#layout-type"
      @change="onChangeLayout"
    />
  </div>
</template>

<script src="./script.js" />
