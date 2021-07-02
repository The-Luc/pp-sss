<template>
  <div class="color-container">
    <span class="properties-title">{{ label }}: </span>
    <div class="color-content">
      <div ref="boxColor" class="box-color">
        <div
          :style="{ backgroundColor: color }"
          class="box-color-active"
          @click="onOpenColorPicker"
        />
      </div>
      <v-icon @click="onOpenEyeDropper">colorize</v-icon>
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
