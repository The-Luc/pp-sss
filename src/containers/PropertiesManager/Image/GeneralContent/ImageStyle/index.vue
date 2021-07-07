<template>
  <div class="image-style-container">
    <label class="properties-title">Image Style:</label>
    <div class="select-box">
      <div class="select-box-items">
        <div
          v-for="(imageStyleSelectBox, index) in imagesStyleSelectBox"
          :key="index"
          :class="[
            'item-style',
            { active: imageStyleSelectBox.id === imageStyleSelected }
          ]"
        >
          <img
            :src="imageStyleSelectBox.imageUrl"
            @click="onSelectImageStyle(imageStyleSelectBox.id)"
          />
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
        <div
          v-for="(imageStyle, index) in imagesStyle"
          :key="index"
          :class="[
            'item-style',

            { active: imageStyle.id === imageStyleSelected }
          ]"
          @click="onSelectImageStyle(imageStyle.id)"
        >
          <img :class="imageStyle.className" :src="imageStyle.imageUrl" />
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
