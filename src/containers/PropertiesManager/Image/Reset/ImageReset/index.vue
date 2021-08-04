<template>
  <div>
    <div class="image-reset-container">
      <label class="properties-title">Image Reset:</label>
      <div class="d-flex justify-space-between">
        <PpButton
          :is-disabled="disabled"
          class="w-100 btn-detail button-property"
          @click.native="onClickCropImage"
        >
          <img src="@/assets/icons/crop-image.svg" />
          <span>
            Centercrop Image
          </span>
        </PpButton>
        <PpButton
          :is-disabled="disabled"
          class="w-100 btn-detail button-property"
          @click.native="onClickRemoveImage"
        >
          <img src="@/assets/icons/remove-image.svg" />
          <span>Remove Image</span>
        </PpButton>
      </div>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
