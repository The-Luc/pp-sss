<template>
  <div>
    <TextStyle />
    <Fonts />
    <Effect />
    <div class="alignment-container">
      <Alignment :selected-alignment="selectedAlignment" @change="onChange" />
      <Vertical />
    </div>
    <Spacing />
    <Animation
      v-if="isDigitalEdition"
      title="Text animation"
      :play-in-config="playInConfig"
      :play-out-config="playOutConfig"
      @change="onChange"
      @apply="onApply"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
