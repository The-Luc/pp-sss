<template>
  <div>
    <TextStyle />
    <Fonts />
    <Effect />
    <div class="alignment-container">
      <Alignment />
      <Vertical />
    </div>
    <Spacing />
    <Animation
      v-if="isDigitalEdition"
      title="Text animation"
      :play-in-config="playInConfig"
      :play-out-config="playOutConfig"
      @change="changeAnimation"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
