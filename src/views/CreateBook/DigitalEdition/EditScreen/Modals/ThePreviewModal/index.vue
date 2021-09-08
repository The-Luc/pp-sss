<template>
  <div id="transition-preview">
    <common-modal
      :can-close-outside="false"
      accept-text="Apply Portraits to Pages"
      width="820"
      container="#transition-preview"
      :is-open-modal="true"
      :is-header-displayed="false"
      :is-footer-displayed="false"
      @cancel="onClose"
    >
      <div class="container">
        <transition :name="transitionType">
          <div
            :key="imageKey"
            class="thumb"
            :style="{
              backgroundImage: `url(${imageUrl})`,
              backgroundPosition,
              transition: transitionCss
            }"
          ></div>
        </transition>
      </div>
    </common-modal>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
