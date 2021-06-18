<template>
  <div>
    <FillColor />

    <Opacity :value="opacityValue" @change="onChangeOpacity" />

    <Border :selected-border="selectedBorder" :options="borderOptions" />

    <Shadow :selected-shadow="selectedShadow" :options="shadowOptions" />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
