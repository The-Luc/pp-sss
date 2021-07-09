<template>
  <div>
    <ImageReset
      @onClickCropImage="onClickCropImage"
      @onClickRemoveImage="onClickRemoveImage"
    />
    <Background @onClickBackgroundImage="onClickBackgroundImage" />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
