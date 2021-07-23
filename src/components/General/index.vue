<template>
  <div>
    <FillColor
      v-if="isAllowFillColor"
      :value="colorValue"
      @change="onChangeColor"
    />

    <Opacity :value="opacityValue" @change="onChangeOpacity" />

    <Border
      v-if="isShowBorder"
      :current-border="currentBorder"
      @change="onChangeBorder"
    />

    <Shadow
      :current-shadow="currentShadow"
      @change="onChangeShadow"
      @changeDropShadow="onChangeDropShadow"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
