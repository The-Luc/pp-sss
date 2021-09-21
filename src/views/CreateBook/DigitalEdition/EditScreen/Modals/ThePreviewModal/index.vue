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
        <transition-group
          v-if="transition === 5"
          :name="transitionType"
          tag="div"
          class="wrapper"
        >
          <div
            :key="`img-%${imageKey}`"
            class="thumb"
            :style="{
              backgroundImage: `url(${imageUrl})`,
              backgroundPosition,
              transition: transitionCss
            }"
          ></div>

          <div
            :key="`mask-%${imageKey}`"
            class="thumb-mask"
            :style="{
              backgroundImage: `url(${maskUrl})`,
              transition: transitionCss
            }"
          ></div>
        </transition-group>

        <transition v-else :name="transitionType">
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
