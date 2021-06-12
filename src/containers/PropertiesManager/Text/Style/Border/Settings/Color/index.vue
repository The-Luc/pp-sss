<template>
  <div class="border-color-picker-container">
    <div class="color-container">
      <span class="properties-title">Color: </span>
      <div class="color-content">
        <div class="box-color">
          <div
            :style="{ backgroundColor: color }"
            class="box-color-active"
            @click="onOpenColorPicker"
          />
        </div>
        <v-icon>colorize</v-icon>
      </div>
    </div>
    <!-- <Mix :value="color" /> -->
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
