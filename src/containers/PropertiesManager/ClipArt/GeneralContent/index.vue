<template>
  <div>
    <FillColor />
    <Opacity :value="opacityValue" @change="onChangeOpacity" />
    <Shadow
      :selected-shadow="selectedShadow"
      :options="shadowOptions"
      @change="onChangeShadow"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
