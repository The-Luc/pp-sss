<template>
  <div>
    <ImageStyle
      :image-style-selected="imageStyleSelected"
      :images-style="imagesStyle"
      @onSelectImageStyle="onSelectImageStyle"
    />
    <Opacity :value="opacityValue" @change="onChangeOpacity" />
    <Border
      :selected-border="selectedBorder"
      :options="borderOptions"
      @change="changeBorderOption"
    />
    <Shadow
      :current-shadow="currentShadow"
      @change="onChangeShadow"
      @changeDropShadow="onChangeDropShadow"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
