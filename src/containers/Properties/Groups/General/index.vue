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
      v-if="isDigital && isAnimationDisplayed"
      :title="animationTitle"
      :play-in-config="playInConfig"
      :play-out-config="playOutConfig"
      :play-in-order="playInOrder"
      :play-out-order="playOutOrder"
      :apply-options="applyOptions"
      :order-options="orderOptions"
      @apply="onApplyAnimation"
      @preview="onClickPreview"
      @changeOrder="onChangeOrder"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
