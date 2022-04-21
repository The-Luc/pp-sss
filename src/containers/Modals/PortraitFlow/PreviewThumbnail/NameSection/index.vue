<template>
  <div
    :class="['name-container', { right: isPageRight }]"
    :style="containerCssStyle"
  >
    <div
      v-for="(portraitRows, rowIndex) in portraits"
      :key="rowIndex"
      class="names"
      :style="rowCssStyle"
    >
      <name-item
        v-for="(portrait, index) in portraitRows"
        :key="index"
        :first-name="portrait.firstName"
        :last-name="portrait.lastName"
        :is-first-last-display="isFirstLastDisplay"
        :is-under-portrait="false"
        :css-style="nameCssStyle"
      ></name-item>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
