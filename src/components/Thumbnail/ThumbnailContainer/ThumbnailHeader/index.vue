<template>
  <div class="thumbnail-view-header" :class="customCssClass">
    <div class="header-container" @click="toggleContent">
      <div class="header-content">
        <div class="header-color" :style="{ 'background-color': color }"></div>

        <v-icon v-if="isToggleContentAvailable" class="header-toggle">
          {{ arrowIcon }}
        </v-icon>

        <div class="header-name">
          {{ name }}

          <span v-if="isTotalDisplayed" class="total-item">
            ({{ totalItem }})
          </span>
        </div>
      </div>

      <div class="header-more">
        <v-icon class="icon-more">more_horiz</v-icon>
      </div>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
