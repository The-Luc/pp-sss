<template>
  <div class="color-container">
    <span class="properties-title">{{ label }}: </span>
    <div class="color-content">
      <div ref="boxColor" class="box-color">
        <div
          :style="{ backgroundColor: color }"
          class="box-color-active"
          @click="onOpen"
        />
      </div>
      <v-icon v-if="colorize">colorize</v-icon>
      <PickerPopup
        v-if="isOpen"
        :top="top"
        :left="left"
        :color="color"
        @change="onChange"
        @close="onClose"
      />
    </div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
