<template>
  <Modal
    class="modal-theme"
    title="Yearbook Theme"
    width="800"
    :show-top-bg="false"
  >
    <div class="modal-theme-body">
      <div class="modal-theme-title">Select a theme to get started</div>
      <div class="modal-theme-note">
        (Don’t worry, you can change this selection at any time.)
      </div>
      <div class="modal-theme-container">
        <div
          v-for="theme in themes"
          :key="theme.id"
          :class="[
            'modal-theme-item',
            { active: selectedThemeId === theme.id },
          ]"
          @click="onSelectTheme(theme.id)"
        >
          <div class="modal-theme-img">
            <img src="@/assets/image/theme.jpg" alt="" />
          </div>
          <div class="modal-theme-name">{{ theme.name }}</div>
        </div>
      </div>
    </div>
    <div class="modal-theme-footer">
      <PpButton class="button-select" is-active>Select</PpButton>
    </div>
  </Modal>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
