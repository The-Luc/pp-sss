<template>
  <div ref="propertiesContainer" class="properties-container">
    <component :is="renderObject" />
    <PickerPopup v-if="isOpenColorPicker" :top="top" :right="right" />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
