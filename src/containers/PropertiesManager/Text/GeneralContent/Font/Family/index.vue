<template>
  <div>
    <span class="properties-title">Font Family:</span>
    <PpSelect :selected-val="selectedFont" :items="fonts" @change="onChange" />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
