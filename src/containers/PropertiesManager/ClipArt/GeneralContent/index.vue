<template>
  <div>
    <FillColor
      v-if="isAllowFillColor"
      :value="colorValue"
      @change="onChangeColor"
    />

    <Opacity :value="opacityValue" @change="onChangeOpacity" />

    <Shadow :selected-shadow="selectedShadow" :options="shadowOptions" />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
