<template>
  <div>
    <div class="image-background-container">
      <label class="properties-title">Set Image as Background:</label>
      <PpButton
        class="w-100 btn-detail button-property"
        @click.native="onClickBackgroundImage"
      >
        <img src="@/assets/icons/fill-image.svg" />
        <span>
          Fill Spread As Background Image
        </span>
      </PpButton>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
