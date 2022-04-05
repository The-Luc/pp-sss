<template>
  <v-dialog
    content-class="pp-modal"
    overlay-color="#000"
    overlay-opacity="0.7"
    :persistent="!canCloseOutside"
    :value="isOpenModal"
    :width="width"
    :attach="container"
    @click:outside="onClickOutside"
    @keydown="onEscape"
  >
    <v-card>
      <Header
        v-if="isDefaulHeaderDisplayed"
        :title="title"
        :is-theme-used="isThemeUsed"
        :is-back-icon-displayed="isBackIconDisplayed"
        :is-close-icon-displayed="isCloseIconDisplayed"
        :is-dark="isDarkHeader"
        @back="onBack"
        @cancel="onCancel"
      />

      <slot name="header"></slot>

      <v-card-text :class="{ 'card-text-theme-modal': isThemeUsed }">
        <slot></slot>
      </v-card-text>

      <Footer
        v-if="isDefaulFooterDisplayed"
        :cancel-text="cancelText"
        :accept-text="acceptText"
        :is-accept-button-disabled="isAcceptButtonDisabled"
        :is-cancel-button-displayed="isCancelButtonDisplayed"
        @cancel="onCancel"
        @accept="onAccept"
      />

      <slot name="footer"></slot>
    </v-card>
  </v-dialog>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
