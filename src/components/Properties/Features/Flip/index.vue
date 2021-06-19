<template>
  <div class="d-flex flex-column flip-container">
    <span class="properties-title">Flip:</span>

    <div class="d-flex">
      <ButtonProperty title="Horizontal">
        <img
          slot="icon"
          class="icon-right"
          src="@/assets/icons/switch-right.svg"
        />
      </ButtonProperty>

      <ButtonProperty title="Vertical">
        <img
          slot="icon"
          class="icon-right"
          src="@/assets/icons/switch-top.svg"
        />
      </ButtonProperty>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
