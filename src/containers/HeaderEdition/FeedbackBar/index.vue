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
      <PpCombobox
        id="zoom"
        :key="componentKey"
        :items="zoomOptions"
        container="#zoom"
        :selected-val="zoom"
        :nudge-width="145"
        :margin-menu="0"
        :nudge-position="{ nudgeBottom: 2, nudgeLeft: 3 }"
        :appended-icon="appendedIcon"
        @change="changeZoom"
      />
    </div>
    <transition name="slide-fade">
      <PropertiesManager
        v-show="isOpenMenuProperties"
        :is-digital="isDigital"
      />
    </transition>
    <ToolPopoverManager v-show="selectedToolName" :is-digital="isDigital" />
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" />
