<template>
  <div ref="portraitsContainer" class="portraits-container">
    <div ref="portraits" class="portraits">
      <div
        v-for="(portrait, index) in portraits"
        :key="index"
        :class="{ portrait, enlarge: portrait.isLargePortrait }"
      >
        <div class="photo-container">
          <img
            class="photo"
            :src="portrait.imageUrl"
            :alt="portrait.firstName"
          />
        </div>

        <name-item
          v-if="isCenterPosition"
          :first-name="portrait.firstName"
          :last-name="portrait.lastName"
          :css-style="nameCssStyle"
          :is-first-last-display="isFirstLastDisplay"
        ></name-item>
      </div>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
