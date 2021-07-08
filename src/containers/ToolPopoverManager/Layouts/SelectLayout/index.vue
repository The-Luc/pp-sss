<template>
  <div class="pp-layouts-select-layout">
    <span class="pp-layouts-select-layout-title">{{ title }}</span>
    <PpSelect
      :items="items"
      :disabled="disabled"
      :selected-val="layoutSelected"
      @change="onChangeLayout"
    />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
