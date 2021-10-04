<template>
  <component
    :is="isGroup ? 'transition-group' : 'transition'"
    :name="transitionType"
    :tag="isGroup ? 'div' : ''"
    :class="isGroup ? 'wrapper' : ''"
  >
    <div
      :key="`img-%${componentKey}`"
      class="thumb"
      :style="{
        backgroundImage: `url(${imageUrl})`,
        transition: transitionCss
      }"
    ></div>

    <div
      v-if="isGroup"
      :key="`mask-%${componentKey}`"
      class="thumb-mask"
      :style="{
        backgroundImage: `url(${maskUrl})`,
        transition: transitionCss
      }"
    ></div>
  </component>
</template>

<script src="./script.js" />
