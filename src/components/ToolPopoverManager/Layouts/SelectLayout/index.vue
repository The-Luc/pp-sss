<template>
  <div>
    <span class="pp-selected-theme--header--selected-title">Theme:</span>
    <PpSelect :items="items" @change="onChangeTheme" />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
