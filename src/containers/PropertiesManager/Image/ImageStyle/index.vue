<template>
  <div class="image-style-container">
    <label class="properties-title">Image Style:</label>
    <div class="select-box">
      <div class="select-box-items">
        <div
          v-for="(imageStyleOption, index) in imageStyleOptions"
          :key="index"
          :class="[
            'item-style',
            { active: imageStyleOption.id === styleSelected }
          ]"
        >
          <img
            :src="imageStyleOption.imageUrl"
            @click="onSelect(imageStyleOption)"
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
          v-for="(option, index) in options"
          :key="index"
          :class="['item-style', { active: option.id === styleSelected }]"
          @click="onSelect(option)"
        >
          <img :class="option.className" :src="option.imageUrl" />
        </div>
      </div>
    </div>

    <SavedImageStylePopover
      v-if="showSavedStylePopup"
      v-click-outside="onCloseDropdown"
      :items="customOptions"
      :selected-item="styleSelected"
      @change="onSelect"
    />
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
