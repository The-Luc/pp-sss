<template>
  <div class="font-container">
    <div class="col-6">
      <FontFamily :items="fontFamily" />
    </div>
    <div class="col-4">
      <FontSize :items="fontSize" />
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" scoped src="./style.scss" />
