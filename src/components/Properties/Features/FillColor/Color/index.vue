<template>
  <div class="color-container">
    <div class="color-content">
      <div class="box-color">
        <div :style="{ backgroundColor: color }" class="box-color-active" />
      </div>
      <v-icon>colorize</v-icon>
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
