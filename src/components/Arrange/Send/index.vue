<template>
  <div class="d-flex flex-column send-container">
    <span class="properties-title">Send:</span>
    <div class="d-flex">
      <ButtonProperty
        icon-name="flip_to_back"
        title="To Back"
        @click="onClickToBack"
      />
      <ButtonProperty
        icon-name="flip_to_front"
        title="To Front"
        @click="onClickToFront"
      />
      <v-divider vertical class="item-vertical"></v-divider>
      <ButtonProperty
        icon-name="flip_to_back"
        title="Backward"
        @click="onClickBackward"
      >
        <img slot="icon" class="icon-right" src="@/assets/icons/backward.svg" />
      </ButtonProperty>
      <ButtonProperty
        icon-name="flip_to_back"
        title="Forward"
        @click="onClickForward"
      >
        <img slot="icon" class="icon-right" src="@/assets/icons/forward.svg" />
      </ButtonProperty>
    </div>
  </div>
</template>
<script src="./script.js" />

<style lang="scss" src="./style.scss" />
