<template>
  <div>
    <fill-color
      v-if="isAllowFillColor"
      :value="colorValue"
      @change="onChangeColor"
    />

    <opacity :value="opacityValue" @change="onChangeOpacity" />

    <border
      v-if="isShowBorder"
      :current-border="currentBorder"
      @change="onChangeBorder"
    />

    <pp-shadow
      :current-shadow="currentShadow"
      @change="onChangeShadow"
      @changeDropShadow="onChangeDropShadow"
    />

    <animation
      v-if="isDigital"
      :title="animationTitle"
      :play-in-config="playInConfig"
      :play-out-config="playOutConfig"
      @change="onChangeAnimation"
      @apply="onApplyAnimation"
      @preview="onClickPreview"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
