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
    <animation
      v-if="isDigitalEdition"
      title="Text animation"
      :play-in-config="playInConfig"
      :play-out-config="playOutConfig"
      :play-in-order="playInOrder"
      :play-out-order="playOutOrder"
      :apply-options="applyOptions"
      :order-options="orderOptions"
      @change="onChange"
      @apply="onApply"
      @preview="onClickPreview"
      @changeOrder="onChangeOrder"
    ></animation>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
