<template>
  <div>
    <Opacity :value="opacityValue" @change="onChangeOpacity" />
    <Border :current-border="currentBorder" @change="onChangeBorder" />
    <Shadow
      :current-shadow="currentShadow"
      @change="onChangeShadow"
      @changeDropShadow="onChangeDropShadow"
    />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
