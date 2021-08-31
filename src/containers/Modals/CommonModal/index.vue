<template>
  <v-dialog
    content-class="pp-modal"
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
        :is-close-icon-displayed="isCloseIconDisplayed"
        @click="onCancel"
      />

      <slot name="header"></slot>

      <v-card-text :class="{ 'card-text-theme-modal': isThemeUsed }">
        <slot></slot>
      </v-card-text>

      <Footer
        v-if="isDefaulFooterDisplayed"
        :cancel-text="cancelText"
        :accept-text="acceptText"
        :is-disable-accept="isDisableAccept"
        @cancel="onCancel"
        @accept="onAccept"
      />

      <slot name="footer"></slot>
    </v-card>
  </v-dialog>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
