<template>
  <div>
    <div class="modal-theme-title">Select a theme to get started</div>
    <div class="modal-theme-note">
      (Don’t worry, you can change this selection at any time.)
    </div>
    <div class="modal-theme-container">
      <div
        v-for="theme in themes"
        :key="theme.id"
        :class="['modal-theme-item', { active: selectedThemeId === theme.id }]"
      >
        <div class="modal-theme-img" @click="onSelectTheme(theme.id)">
          <img
            v-if="theme.imageUrl"
            :src="require(`@/assets/image/themes/${theme.imageUrl}`)"
            alt="theme"
          />
          <div class="modal-theme-layer">
            <div
              class="modal-theme-icon"
              @click.stop="onPreviewTheme(theme.id)"
            >
              <v-icon class="icon">pageview</v-icon>
            </div>
            <div class="modal-theme-label">Preview</div>
          </div>
        </div>
        <div class="modal-theme-name">{{ theme.name }}</div>
      </div>
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" />
