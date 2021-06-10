<template>
  <div>
    <Opacity :value="opacityValue" @change="onChangeOpacity" />
    <Border
      :selected-border="selectedBorder"
      :options="borderOptions"
      @change="onChangeBorder"
    />
    <Shadow
      :selected-shadow="selectedShadow"
      :options="shadowOptions"
      @change="onChangeShadow"
    />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
