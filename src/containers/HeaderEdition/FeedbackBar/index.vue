<template lang="">
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
      <span>w:</span> <span class="feedback-value">- - -</span>
    </div>
    <div class="feedback-text">
      <span>h:</span> <span class="feedback-value">- - -</span>
    </div>
    <!-- //zoom -->
    <div class="feedback-title">
      Zoom:
    </div>
    <div class="feedback-select feedback-value">
      <PpCombobox
        :items="[
          { name: 'aa', value: 1 },
          { name: 'bb', value: 2 }
        ]"
        :nudge-width="120"
        :appended-icon="appendedIcon"
        @change="changeZoom"
      />
    </div>
    <transition name="slide-fade">
      <PropertiesManager v-show="isOpenMenuProperties" />
    </transition>
    <ToolPopoverManager v-show="selectedToolName" />
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" src="./style.scss" />
