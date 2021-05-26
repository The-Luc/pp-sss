<template>
  <div class="color-picker-container">
    <photoshop-picker v-model="colors" @ok="onOk" @cancel="onCancel"></photoshop-picker>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
