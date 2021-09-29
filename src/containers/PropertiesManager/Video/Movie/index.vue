<template>
  <div class="general-container">
    <Control />
    <Volume />
    <div>
      <Trim />
      <PosterFrame />
    </div>
    <Playback />
    <animation
      title="Video animation"
      :play-in-config="playInConfig"
      :play-out-config="playOutConfig"
      :play-in-order="playInOrder"
      :play-out-order="playOutOrder"
      :apply-options="applyOptions"
      :order-options="orderOptions"
      @apply="onApply"
      @preview="onClickPreview"
      @changeOrder="onChangeOrder"
    ></animation>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
