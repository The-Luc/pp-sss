<template>
  <div>
    <div class="opacity-container">
      <Opacity :value="opacityValue" @change="onChangeOpacity" />
    </div>
    <Border
      :selected-border="selectedBorder"
      :options="borderOptions"
      @change="onChangeBorder"
    />
    <Shadow />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
