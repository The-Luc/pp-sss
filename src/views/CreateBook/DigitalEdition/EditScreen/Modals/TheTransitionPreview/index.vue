<template>
  <div id="transition-preview">
    <common-modal
      :can-close-outside="false"
      accept-text="Apply Portraits to Pages"
      width="800"
      container="#transition-preview"
      :is-open-modal="true"
      :is-header-displayed="false"
      :is-footer-displayed="false"
      @cancel="onClose"
    >
      <div class="container">
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
      </div>
    </common-modal>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
