<template>
  <the-preview :width="`${canvasSize.w}px`" :height="`${canvasSize.h}px`">
    <the-content
      v-if="isWipeTransition"
      :transition-type="transitionType"
      :component-key="`${imageKey}`"
      :image-url="imageUrl"
      :mask-url="maskUrl"
      :background-position="backgroundPosition"
      :transition-css="transitionCss"
      :is-group="true"
    ></the-content>

    <the-content
      v-else
      :transition-type="transitionType"
      :component-key="`${imageKey}`"
      :image-url="imageUrl"
      :mask-url="maskUrl"
      :background-position="backgroundPosition"
      :transition-css="transitionCss"
    ></the-content>
  </the-preview>
</template>

<script src="./script.js" />
