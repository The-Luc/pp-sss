<template>
  <div class="pp-background-select-type">
    <span class="pp-background-select-type-title"></span>
    <PpSelect :items="items" :selected-val="selectedVal" @change="onChange">
    </PpSelect>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" scoped />
