<template>
  <div>
    <FillColor :value="colorValue" @change="onChangeColor" />

    <Opacity :value="opacityValue" @change="onChangeOpacity" />

    <Shadow
      :current-shadow="currentShadow"
      @change="onChangeShadow"
      @changeDropShadow="onChangeDropShadow"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
