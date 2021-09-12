<template>
  <div
    class="frame-container"
    :class="{ empty: isEmpty }"
    @click="onFrameClick"
  >
    <div
      v-if="index > 0"
      class="transition"
      :class="{ active: isTransitionActived }"
      @click="onTransitionIconClick"
    >
      <v-icon>auto_awesome_motion</v-icon>
    </div>

    <div
      class="frame-item"
      :class="{ active: isActived, 'drag-target': isTargeted }"
    >
      <three-dot-menu-icon
        v-if="canMenuIconDisplayed"
        @click="onMenuIconClick"
      ></three-dot-menu-icon>

      <img
        v-if="previewImageUrl && !isEmpty"
        :src="previewImageUrl"
        alt="frame thumbnail"
        class="frame-image"
      />

      <div v-if="isEmpty" class="add-frame-content">
        <v-icon>add_circle_outline</v-icon>
        Add Frame
      </div>
    </div>

    <div class="frame-name">{{ isEmpty ? '' : `Frame ${index + 1}` }}</div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
