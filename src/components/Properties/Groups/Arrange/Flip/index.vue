<template>
  <div class="d-flex flex-column flip-container">
    <span class="properties-title">Flip:</span>
    <div class="d-flex">
      <ButtonProperty
        title="Horizontal"
        :disabled="disabled"
        @click="onClickHorizontal"
      >
        <img
          slot="icon"
          class="icon-right"
          src="@/assets/icons/switch-right.svg"
          alt="Icon of horizontal button"
        />
      </ButtonProperty>
      <ButtonProperty
        title="Vertical"
        :disabled="disabled"
        @click="onClickVertical"
      >
        <img
          slot="icon"
          class="icon-right"
          src="@/assets/icons/switch-top.svg"
          alt="Icon of vertical button"
        />
      </ButtonProperty>
    </div>
  </div>
</template>
<script src="./script.js" />

<style lang="scss" src="./style.scss" />
