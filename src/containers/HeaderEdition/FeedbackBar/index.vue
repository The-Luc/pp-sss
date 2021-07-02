<template>
  <div class="col-12 feedback-bar">
    <div class="feedback-name">
      Info
    </div>
    <!-- // x,y components -->
    <div class="feedback-text">
      <span>x:</span> <span class="feedback-value">-4.312</span>
    </div>
    <div class="feedback-text">
      <span>y:</span> <span class="feedback-value">6.375</span>
    </div>
    <!-- //w,h components -->
    <div class="feedback-text">
      <span>w:</span> <span class="feedback-value">{{ size.width }}</span>
    </div>
    <div class="feedback-text">
      <span>h:</span> <span class="feedback-value">{{ size.height }}</span>
    </div>
    <!-- //zoom -->
    <div class="feedback-title">
      Zoom:
    </div>
    <div class="feedback-select feedback-value">
      <select>
        <option value="volvo">Scale to Fit</option>
        <option value="saab">Saab</option>
      </select>
      <v-icon>arrow_drop_down</v-icon>
    </div>
    <transition name="slide-fade">
      <PropertiesManager v-show="isOpenMenuProperties" />
    </transition>
    <ToolPopoverManager v-show="selectedToolName" />
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
