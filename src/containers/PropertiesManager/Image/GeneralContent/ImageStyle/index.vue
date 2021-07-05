<template>
  <div class="image-style-container">
    <label class="properties-title">Image Style:</label>
    <div class="select-box">
      <div class="select-box-items">
        <div class="item-style active">
          <img src="@/assets/icons/style-image.svg" />
        </div>
        <div class="item-style">
          <img src="@/assets/icons/style-image.svg" />
        </div>
        <div class="item-style">
          <img src="@/assets/icons/style-image.svg" />
        </div>
        <div class="item-style">
          <img src="@/assets/icons/style-image.svg" />
        </div>
      </div>
      <div class="select-icon-dropdown" @click="onOpenDropdown">
        <img src="@/assets/icons/arrow-select.svg" />
      </div>
    </div>
    <div
      v-if="isShowDropdown"
      v-click-outside="onCloseDropdown"
      class="dropdown-box"
    >
      <div class="dropdown-box-items">
        <div class="item-style active">
          <img src="@/assets/icons/style-image.svg" />
        </div>
        <div class="item-style">
          <img src="@/assets/icons/style-image.svg" />
        </div>
        <div class="item-style">
          <img src="@/assets/icons/style-image.svg" />
        </div>
        <div class="item-style">
          <img src="@/assets/icons/style-image.svg" />
        </div>
        <div class="item-style">
          <img src="@/assets/icons/style-image.svg" />
        </div>
        <div class="item-style">
          <img src="@/assets/icons/style-image.svg" />
        </div>
        <div class="item-style">
          <img src="@/assets/icons/style-image.svg" />
        </div>
        <div class="item-style">
          <img src="@/assets/icons/style-image.svg" />
        </div>
        <div class="item-style">
          <img src="@/assets/icons/style-image.svg" />
        </div>
        <div class="item-style">
          <img src="@/assets/icons/style-image.svg" />
        </div>
        <div class="item-style">
          <img src="@/assets/icons/style-image.svg" />
        </div>
        <div class="item-style">
          <img src="@/assets/icons/style-image.svg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
